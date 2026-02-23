/**
 * Application Logger — Best Practices Implementation
 * 
 * Features:
 * - Structured logging with levels (debug, info, warn, error, fatal)
 * - Automatic context enrichment (URL, user agent, session ID)
 * - Batched writes to reduce DB calls
 * - Auto-archive via DB trigger (latest 3 visible, rest archived)
 * - Console mirroring in development
 * - Global error & unhandled rejection capture
 */

import { supabase } from "@/integrations/supabase/client";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  source?: string;
  stack_trace?: string;
}

interface QueuedLog extends LogEntry {
  url: string;
  user_agent: string;
  session_id: string;
  created_at: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

class Logger {
  private queue: QueuedLog[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private sessionId: string;
  private minLevel: LogLevel = "info";
  private batchSize = 10;
  private flushInterval = 5000; // ms
  private isFlushing = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalHandlers();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log({ level: "debug", message, context });
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log({ level: "info", message, context });
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log({ level: "warn", message, context });
  }

  error(message: string, context?: Record<string, unknown>, error?: Error) {
    this.log({
      level: "error",
      message,
      context: { ...context, errorName: error?.name },
      stack_trace: error?.stack,
    });
  }

  fatal(message: string, context?: Record<string, unknown>, error?: Error) {
    this.log({
      level: "fatal",
      message,
      context: { ...context, errorName: error?.name },
      stack_trace: error?.stack,
    });
    // Fatal logs flush immediately
    this.flush();
  }

  private log(entry: LogEntry) {
    if (LOG_LEVELS[entry.level] < LOG_LEVELS[this.minLevel]) return;

    // Console mirror
    const consoleFn = entry.level === "fatal" ? "error" : entry.level === "debug" ? "log" : entry.level;
    console[consoleFn as "log" | "info" | "warn" | "error"](
      `[${entry.level.toUpperCase()}] ${entry.message}`,
      entry.context || ""
    );

    const queued: QueuedLog = {
      ...entry,
      url: typeof window !== "undefined" ? window.location.href : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      session_id: this.sessionId,
      created_at: new Date().toISOString(),
    };

    this.queue.push(queued);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.queue.length === 0 || this.isFlushing) return;

    this.isFlushing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      const rows = batch.map((log) => ({
        level: log.level,
        message: log.message,
        context: (log.context || {}) as Record<string, string | number | boolean | null>,
        source: log.source || "frontend",
        session_id: log.session_id,
        url: log.url,
        user_agent: log.user_agent,
        stack_trace: log.stack_trace || null,
        created_at: log.created_at,
      }));

      const { error } = await supabase.from("app_logs").insert(rows);

      if (error) {
        console.error("[Logger] Failed to flush logs:", error.message);
        // Put failed logs back
        this.queue.unshift(...batch);
      }
    } catch (err) {
      console.error("[Logger] Flush exception:", err);
      this.queue.unshift(...batch);
    } finally {
      this.isFlushing = false;
    }

    // If there are more queued, schedule another flush
    if (this.queue.length > 0) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  private setupGlobalHandlers() {
    if (typeof window === "undefined") return;

    window.addEventListener("error", (event) => {
      this.error(
        `Uncaught: ${event.message}`,
        { filename: event.filename, lineno: event.lineno, colno: event.colno },
        event.error
      );
    });

    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      this.error(
        `Unhandled Promise: ${reason?.message || String(reason)}`,
        {},
        reason instanceof Error ? reason : undefined
      );
    });

    // Flush on page unload
    window.addEventListener("beforeunload", () => {
      this.flush();
    });
  }
}

// Singleton
export const logger = new Logger();
