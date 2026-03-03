#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_FILE = 'OpenClaw-PM配置升级指南.md';

// 尝试找到 OpenClaw workspace
function findOpenClawWorkspace() {
  const possiblePaths = [
    path.join(os.homedir(), '.openclaw', 'workspace'),
    path.join(os.homedir(), 'openclaw'),
    process.cwd()
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      // 检查关键文件（支持大小写）
      const keyFiles = ['AGENTS.md', 'agents.md', 'SOUL.md', 'soul.md'];
      const hasKeyFile = keyFiles.some(f => fs.existsSync(path.join(p, f)));
      if (hasKeyFile) {
        return p;
      }
    }
  }
  return null;
}

// 安全读取文件
function safeReadConfig() {
  const configPath = path.join(__dirname, 'config', CONFIG_FILE);
  
  if (!fs.existsSync(configPath)) {
    console.error(`\n❌ 错误：找不到配置文件 ${CONFIG_FILE}`);
    console.error(`   预期路径：${configPath}`);
    return null;
  }
  
  try {
    return fs.readFileSync(configPath, 'utf-8');
  } catch (err) {
    console.error(`\n❌ 错误：读取配置文件失败 - ${err.message}`);
    return null;
  }
}

console.log('\n🚀 OpenClaw 项目经理配置升级工具\n');
console.log('='.repeat(50));

const workspace = findOpenClawWorkspace();
const configContent = safeReadConfig();

if (!configContent) {
  console.log('\n💡 请检查是否正确安装了此工具。\n');
  process.exit(1);
}

if (workspace) {
  // 找到了 workspace，保存配置文件
  const targetPath = path.join(workspace, CONFIG_FILE);
  fs.writeFileSync(targetPath, configContent);
  console.log(`\n✅ 配置文件已保存到: ${targetPath}\n`);
  console.log('📋 下一步：');
  console.log('   把这个文件的内容发给你的 OpenClaw，它会自动完成升级。\n');
  console.log(`   或者直接告诉 OpenClaw：\n`);
  console.log(`   "请读取 ${CONFIG_FILE} 并按照指南升级配置"\n`);
} else {
  // 没找到 workspace，输出内容让用户复制
  console.log('\n📋 请把以下内容复制发送给你的 OpenClaw：\n');
  console.log('-'.repeat(50));
  console.log(configContent);
  console.log('-'.repeat(50));
  console.log('\n💡 提示：OpenClaw 会自动根据指南升级你的配置。\n');
}
