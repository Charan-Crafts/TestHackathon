// Debug helper utility
const DEBUG_MODE = true;

export const debug = (message, data = null) => {
    if (DEBUG_MODE) {
        if (data) {
            console.log(`[DEBUG] ${message}:`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
};

export const errorLogger = (error, context = '') => {
    if (DEBUG_MODE) {
        console.error(`[ERROR] ${context}:`, error);
        if (error.stack) {
            console.error('[STACK]', error.stack);
        }
    }
};

export const logRenderCycle = (componentName) => {
    if (DEBUG_MODE) {
        console.log(`[RENDER] ${componentName} rendering`);
    }
};

export default {
    debug,
    errorLogger,
    logRenderCycle
}; 