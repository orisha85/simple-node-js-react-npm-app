module.exports = {
    user: 'smc_readwrite',
    password: 'Mxyk3x2023aplyi',
    server: 'SMC-SQL-AZ',
    database: 'SMC_APP_DEV',
    options: {
        encrypt: true, // For Azure SQL
        trustServerCertificate: true, // Change this depending on your certificate configuration
        connectionTimeout: 15000,
        enableArithAbort: true
    },
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
