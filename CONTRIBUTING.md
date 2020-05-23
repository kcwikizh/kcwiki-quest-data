# Contributing Guides / 贡献指南

当前任务数据全部都是人工维护的，因此难免出现疏忽或延迟的情况。

欢迎各位提督帮助我们补充新的任务数据或者修正错误。

## How to Contribute in Issues / 如何汇报问题

你可以使用 [GitHub Issues](https://github.com/kcwikizh/kcwiki-quest-data/issues) 创建一个公开的报告。

如果没有 GitHub 账号，也可以通过[联系 poi](https://github.com/poooi/poi#contact-us) 反馈问题。

## How to Contribute to quest data / 如何帮助我们补充缺失的数据

### Contribution Prerequisites / 贡献前提

- 如果不了解 [GitHub](https://guides.github.com/activities/hello-world/)，强烈建议花一点时间熟悉。
- 在接下来的步骤中推荐使用 [Visual Studio Code](https://code.visualstudio.com/) 以获得舒适的自动补全和错误提示。

### If you are a developer / 如果你是一个开发者

See [README.md](README.md). (Fly bitch!!.jpg)

### If you are an admiral / 如果你是一个提督

#### Step 1: Fork

在 GitHub fork 这个项目，并且 clone 你的 fork 到本地。

```sh
git clone git@github.com:$(YOUR_GITHUB_USERNAME)/kcwiki-quest-data.git
cd kcwiki-quest-data
git remote add upstream https://github.com/kcwikizh/kcwiki-quest-data.git
git fetch upstream
```

配置 git 用户名和邮箱。

```sh
git config user.name "YOUR.NAME"
git config user.email "YOUR.NAME@example.com"
```

#### Step 2: Branch

为了保持你的工作环境干净整洁，我们推荐创建一个本地的分支。

```sh
git checkout -b feat/data --track upstream/master
```

#### Step 3: Code

- 为了获得更好的自动补全和错误提示你可以下载 [schema-quest.json](https://github.com/kcwikizh/kcwiki-quest-data/raw/gh-pages/schema-quest.json) 放入`build` （需自己新建）文件夹下。
- 在 `draft` 文件夹中挑选你感兴趣的任务进行补充。
- 文件格式可以参照 `data` 目录下已完成的其他文件，或者试着查看 [任务的类型定义](types/index.ts)。

#### Step 4: Commit

提交你的更改。

```sh
git add draft
git commit --message "feat(data): update data"
```

#### Step 5: Rebase

作为最佳实践，一旦提交了更改，最好使用 `git rebase`（而不是`git merge`）将你的仓库与主存储库同步。

```sh
git fetch upstream
git rebase upstream/master
```

#### Step 6: Test

最后检查一下。

#### Step 7: Push

将你的提交推送到远端的仓库。

```sh
git push origin feat/data
```

#### Step 8: Opening the Pull Request

可以从[这里](https://github.com/kcwikizh/kcwiki-quest-data/pulls)打开一个 Pull Request

#### Step 9: Discuss and update

你可以关注你的 Pull Request，开发者将会很快回应。

#### Step 10: Landing

接下来请坐和放宽，感谢你的贡献！
