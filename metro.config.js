const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Isso força o Metro a aceitar os caminhos de exportação do Node mais recente
config.resolver.unstable_enablePackageExports = false;

module.exports = config;