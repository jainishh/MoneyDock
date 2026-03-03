import fs from 'fs';

const logPath = './backend/error.log';

function readTail(filePath, bytesToRead = 1000) {
    try {
        const stats = fs.statSync(filePath);
        const size = stats.size;
        const start = Math.max(0, size - bytesToRead);
        const buffer = Buffer.alloc(Math.min(size, bytesToRead));

        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, buffer.length, start);
        fs.closeSync(fd);

        console.log('--- LOG TAIL ---');
        console.log(buffer.toString());
        console.log('--- END LOG TAIL ---');
    } catch (err) {
        console.error('Error reading log:', err.message);
    }
}

readTail(logPath);
