// defaults to 'development'
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const isProduction = environment === "production";
// defaults to 3000, (80 for 'production')
const port =  process.env.PORT ? +process.env.PORT : isProduction ? 80 : 3000;
// defaults to 3443, (443 for 'production')
const httpsPort =  process.env.HTTPS_PORT ? +process.env.HTTPS_PORT : isProduction ? 443 : port + 443;
// defaults to true
const useSSL =  process.env.USE_SSL ? process.env.USE_SSL.trim() === 'true' : true;
// defaults to false
const useMock = process.env.USE_MOCK ? process.env.USE_MOCK.trim() === 'true' : false;

const env = {
    environment,
    isProduction,
    port,
    httpsPort,
    useSSL,
    useMock  
};

console.log('Environment', env);

module.exports = env;