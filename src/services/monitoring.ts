interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: number;
  memoryUsage: number;
  errorRate: number;
  lastCheck: string;
}

class MonitoringService {
  private startTime: number;
  private errorCount: number = 0;
  private totalRequests: number = 0;

  constructor() {
    this.startTime = Date.now();
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor performance
    if ('performance' in window) {
      this.trackPerformanceMetrics();
    }

    // Monitor errors
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack
      });
    });

    // Periodic health checks
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute
  }

  private trackPerformanceMetrics() {
    if (!('performance' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric({
          name: entry.name,
          value: entry.duration || entry.startTime,
          timestamp: new Date().toISOString()
        });
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
  }

  private recordMetric(metric: PerformanceMetric) {
    const metrics = this.getMetrics();
    metrics.push(metric);

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }

    localStorage.setItem('performance_metrics', JSON.stringify(metrics));
  }

  private recordError(error: any) {
    this.errorCount++;
    
    const errors = this.getErrors();
    errors.push({
      ...error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }

    localStorage.setItem('app_errors', JSON.stringify(errors));
  }

  private performHealthCheck(): SystemHealth {
    const uptime = Date.now() - this.startTime;
    const errorRate = this.totalRequests > 0 ? (this.errorCount / this.totalRequests) * 100 : 0;
    
    // Estimate memory usage (simplified)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    if (errorRate > 10) status = 'error';
    else if (errorRate > 5 || memoryUsage > 50000000) status = 'warning';

    const health: SystemHealth = {
      status,
      uptime,
      memoryUsage,
      errorRate,
      lastCheck: new Date().toISOString()
    };

    localStorage.setItem('system_health', JSON.stringify(health));
    return health;
  }

  getMetrics(): PerformanceMetric[] {
    const metrics = localStorage.getItem('performance_metrics');
    return metrics ? JSON.parse(metrics) : [];
  }

  getErrors(): any[] {
    const errors = localStorage.getItem('app_errors');
    return errors ? JSON.parse(errors) : [];
  }

  getSystemHealth(): SystemHealth {
    const health = localStorage.getItem('system_health');
    return health ? JSON.parse(health) : this.performHealthCheck();
  }

  incrementRequestCount() {
    this.totalRequests++;
  }

  // Public method to manually track errors
  trackError(error: Error | string, context: string) {
    const errorObj = typeof error === 'string' 
      ? new Error(error) 
      : error;
    
    this.recordError({
      type: 'manual_error',
      message: errorObj.message,
      stack: errorObj.stack,
      context
    });
  }
}

export const monitoring = new MonitoringService();