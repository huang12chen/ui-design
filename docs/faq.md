# Troubleshooting and FAQ / 常见问题

[安装 / Install](install.md) · [中文说明](../README.md) · [English README](../README.en.md)

## Is this a template or a website generator? / 这是模板吗？

The Skill gives a coding agent methods for researching, designing, building and checking an interface. The included sites are separate fictional examples. Copying an example gives you that example; a new design still needs your goals and content.

Skill 是给编码智能体的方法；附带网站是独立的虚构示例。直接复制示例只会得到示例本身，设计新项目仍需要你的目标和内容。

## Does it force one look or a particular effect? / 会固定一种风格吗？

No. Structure, type, density, media, colors and motion follow the audience and task. A brand campaign, an order table and a portfolio can make different choices. Motion is optional and should help the experience; there is no fixed number of effects.

不会。版式、字体、密度、媒体、颜色和动效应由用户与任务决定。品牌活动页、订单表格和作品集可以不同；动效按需要使用，不规定固定数量。

## What does self-check prove? / 自检能证明什么？

It measures documented rules on a compatible static build. Exit 2 means a requested check could not finish; `--static-only` skips the browser deliberately. Some rules were developed for portfolios, so review false positives and unmeasured dimensions. A clean report does not establish visual quality or prove a full user journey.

它只能测量兼容静态构建产物上的已列规则。退出码 2 表示请求的检查没能完成；`--static-only` 会主动跳过浏览器。部分规则来自作品集场景，要结合产品判断误报和未测项目。通过检查不代表视觉效果或完整流程合格。

## Do the examples need an account or API key? / 示例需要账号或 API Key 吗？

No. The examples use fictional content and run locally without an account, paid API or model request. Kora has no checkout; Draft Studio uses a local template. Your own coding tool, model and hosting may have separate costs.

不需要。示例使用虚构内容，可在本地运行；Kora 没有支付，Draft Studio 使用本地模板。你选择的编码工具、模型和托管服务可能另有费用。

## An example does not open / 示例打不开

Run `npm run dev:examples` and open the printed local address. The older `npm run dev` serves the portfolio only. If the port is occupied, choose another one rather than stopping an unrelated process:

```powershell
$env:PORT = '4191'
npm run dev:examples
```

使用终端打印的地址；如果端口已被占用，换一个端口即可。请勿直接双击依赖模块的网站文件。

## The Skill is not visible / 找不到 Skill

Check that the complete `ui-design` folder is in the host's supported discovery path and `SKILL.md` is directly inside it. Refresh or restart the host if needed. Do not create nested copies or overwrite private Skills. See [installation](install.md).

检查完整文件夹、入口层级和宿主的发现目录；必要时刷新或重启。不要覆盖自己的私人 Skill，详见[安装指南](install.md)。

## A reference is blocked / 参考网站打不开

Record the exact inaccessible step and try a relevant accessible source. A title, screenshot, or recording is not proof that an interaction or original implementation was tested.

记录具体阻碍并寻找可访问的替代来源；标题、截图或录像不等于已操作交互或研究过原始实现。

## The result cannot be copied / 结果无法复制

Draft Studio disables copying when its input changes. Build again to update the result. Clipboard access also depends on the browser and permission; if unavailable, select the visible text manually.

Draft Studio 修改输入后会停用旧结果的复制，需要重新生成。浏览器剪贴板权限不可用时，可以手动选择并复制可见文字。
