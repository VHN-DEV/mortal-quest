import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

/**
 * Logger Utility - Laravel-style structured logging for Mortal Quest.
 * Supports categories, levels, and persistent file logging.
 */
class Logger {
    constructor() {
        this.enabled = true; // Still enabled to allow ERROR output
        this.persist = true; // Toggle for file persistence
        this.levels = {
            DEBUG: { color: '#94a3b8', priority: 0 },
            INFO: { color: '#3b82f6', priority: 1 },
            WARN: { color: '#eab308', priority: 2 },
            ERROR: { color: '#ef4444', priority: 3 }
        };
        this.currentPriority = 3; // ONLY SHOW ERROR IN CONSOLE BY DEFAULT
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        try {
            // Create logs directory if it doesn't exist
            await Filesystem.mkdir({
                path: 'logs',
                directory: Directory.Data,
                recursive: true
            }).catch(() => {}); // Ignore error if exists
            
            this.initialized = true;
            // Removed noisy initialization log
        } catch (e) {
            console.warn('Logger initialization failed. Persistent logging disabled.', e);
            this.persist = false;
        }
    }

    /**
     * Internal logging method
     */
    async _log(level, category, message, ...args) {
        const priority = this.levels[level].priority;
        
        // Only proceed if it's an error for console OR at least a warning for file
        if (priority < 2 && !this.enabled) return; 

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const formattedMessage = `[${timestamp}] [${category.toUpperCase()}] [${level}] ${message}`;

        // 1. Console Output - Only if priority matches currentPriority (default ERROR)
        if (this.enabled && priority >= this.currentPriority) {
            const levelConfig = this.levels[level];
            console.log(`%c${formattedMessage}`, `color: ${levelConfig.color}`, ...args);
        }

        // 2. Persistent Logging (Laravel-style files) - ONLY WARN AND ERROR
        if (this.persist && this.initialized && priority >= 2) {
            this._writeToFile(dateStr, category, formattedMessage);
        }
    }

    async _writeToFile(date, category, message) {
        try {
            const fileName = `logs/mortal-quest-${date}.log`;
            
            // Append to file (simulated by reading and writing or using actual append if supported)
            // Note: Capacitor Filesystem.appendFile is supported in newer versions
            await Filesystem.appendFile({
                path: fileName,
                data: message + '\n',
                directory: Directory.Data,
                encoding: Encoding.UTF8
            });
        } catch (e) {
            // If file doesn't exist, writeFile will be used by some implementations, 
            // but here we might need to handle it.
            try {
                await Filesystem.writeFile({
                    path: `logs/mortal-quest-${date}.log`,
                    data: message + '\n',
                    directory: Directory.Data,
                    encoding: Encoding.UTF8
                });
            } catch (err) {
                // Silently fail to avoid infinite loops if logging itself fails
            }
        }
    }

    debug(category, message, ...args) { this._log('DEBUG', category, message, ...args); }
    info(category, message, ...args) { this._log('INFO', category, message, ...args); }
    warn(category, message, ...args) { this._log('WARN', category, message, ...args); }
    error(category, message, ...args) { this._log('ERROR', category, message, ...args); }

    /**
     * Disable logs for production performance
     */
    disable() {
        this.enabled = false;
        this.persist = false;
    }

    /**
     * Clear all log files
     */
    async clearLogs() {
        try {
            await Filesystem.rmdir({
                path: 'logs',
                directory: Directory.Data,
                recursive: true
            });
            await this.init();
        } catch (e) {
            this.error('system', 'Failed to clear logs', e);
        }
    }
}

export const logger = new Logger();
window.logger = logger; // Global access for debugging
