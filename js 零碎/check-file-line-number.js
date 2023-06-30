// 配合git的pre-commit使用，不对存量代码造成影响，新项目可用
const { exec, execSync } = require("child_process");
const { existsSync, readFileSync, statSync, writeFileSync } = require("fs");
const { join } = require("path");

/* 伪代码
1、提取该次提交中新增的文件相对路径
2、提取之前记录的新增的文件相对路径（记录在该脚本所在目录下，名称为new-file-arr.json，没有就新增）
3、对二者取交集，筛出js、ts、jsx、tsx、vue、css、scss、less尾缀文件，写入记录
4、对筛出的文件进行行数检查，抛出警告或拒绝提交
*/

// 在脚本所在目录下，新建一个文件用于收集新增的文件相对路径
const TARGET = join(__dirname, "new-file-arr.json");
// 需要检查行数的文件格式
const shouldCheckMime = [
  "js",
  "ts",
  "jsx",
  "tsx",
  "vue",
  "css",
  "scss",
  "less",
];
// 限制的行数
const MAX_ALLOWED_LINE_NUMBER = 500;

// 包装writeFileSync，统一进行错误处理和写入内容的序列化
const writeToTarget = (content) => {
  try {
    writeFileSync(TARGET, JSON.stringify(content, null, 2), "utf8");
  } catch (e) {
    console.error(`Error writing file: ${e}`);
  }
};

// 包装readFileSync，统一进行错误处理和读取内容的反序列化
const readFromTarget = () => {
  try {
    // 如果目标文件不存在，就写个空数组进去
    if (!existsSync(TARGET)) writeToTarget([]);

    return JSON.parse(readFileSync(TARGET, "utf8"));
  } catch (e) {
    console.error(`Error reading file: ${e}`);
  }
};

const checkFileLineNum = (path) => {
  try {
    // 这里失败说明是被删除的文件
    statSync(path);

    const buffer = execSync(`wc -l ${path}`);
    const lineNum = parseInt(buffer.toString(), 10);

    if (lineNum > MAX_ALLOWED_LINE_NUMBER) {
      // \x1b[31m使输出字符串为红色，\x1b[0m使后续字符串为默认颜色。
      console.error(
        `\x1b[31m${path} 行数过多，请调整文件结构，使文件行数小于${MAX_ALLOWED_LINE_NUMBER}。\x1b[0m`
      );
      process.exit(1);
    }
  } catch (e) {
    console.error(`Error reading file line: ${e}`);
  }
};

exec(
  "git diff --name-only --staged --diff-filter=A",
  { stdio: "inherit" },
  (err, stdout, stderr) => {
    if (err) return console.error(`Error: ${err.message}`);
    if (stderr) return console.error(`Error: ${stderr.message}`);

    // 提取该次提交中新增的文件相对路径
    const newFilePathArr = stdout.split("\n").filter((path) => path !== "");
    // 提取之前记录的新增的文件相对路径
    const recordedFilePathArr = readFromTarget();
    // 取交集得到可能需检查行数的文件相对路径们
    const raw = [...new Set([...newFilePathArr, ...recordedFilePathArr])];
    // 筛出特定文件格式文件们
    const shouldCheckLineNumberFilePathArr = raw.filter((path) =>
      shouldCheckMime.some((mime) => path.endsWith(mime))
    );
    // 写入记录
    writeToTarget(shouldCheckLineNumberFilePathArr);

    shouldCheckLineNumberFilePathArr.forEach((path) => checkFileLineNum(path));
  }
);
