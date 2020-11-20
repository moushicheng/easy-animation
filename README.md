<div align="center"> 
<h1 align="center">Easy-animation</h1>
<img src="https://img.shields.io/github/issues/a1163675107/easy-animation?color=green">
<img src="https://img.shields.io/github/stars/a1163675107/easy-animation?color=yellow">
<img src="https://img.shields.io/github/forks/a1163675107/easy-animationk?color=orange">
<img src="https://img.shields.io/github/license/a1163675107/easy-animation?color=ff69b4">
<img src="https://img.shields.io/github/search/a1163675107/BilibiliTask/main?color=blue">
</div>

# 简介

👯✨😄📫

前端的帧动画制作器,作为用户的你可以直接绘制多个帧，然后点击导出(import),就可以获得相应的css代码!

css代码可以直接置入你的前端项目中使用！✌️

开源不易，如果你觉得有用，就给个star吧！😋

演示：

![image](/src/assets/markdown/pop.gif)



# 功能(V1.0版本)

* [x] 绘笔功能

* [x] 帧时间轴管理

* [x] 图片插入

* [x] 绘制步骤的撤回和前进

* [x] 动画预览


# V2.0版本计划

* [x] 增加绘画图形的色彩填充

* [x] 增加多时间轨道模块

# 如何启动？

## 1.无网络下本地运行

1.克隆项目```git clone git@github.com:a1163675107/easy-animation.git```

2.进入项目根目录,启动指令:```npm install```

3.```npm run serve```

## 2.服务器上在线体验
还未更新......

# 使用教程
## 帧管理

帧的概念:现代动画成形的原理就是视觉暂留，一个时长为1s的动画通常是由多个画面组成，每个画面就是一'帧'，在本项目中,你只需要绘制一些关键帧,程序就能自动补帧,完成动画。

[warning]每一帧对应的画面必须是封闭的图形。

![image-20201120122730113](/src/assets/markdown/image-20201120122730113.png)

### 添加帧

最右方的+可新增一个帧

![image-20201120123152256](/src/assets/markdown/image-20201120123152256.png)

对应帧要写一个具体的时间,三个空槽分别是分:秒:毫秒

### 帧的选择/拖动/删除/调整

![image-20201120123312220](/src/assets/markdown/image-20201120123312220.png)

选择:鼠标左键点击

拖动:鼠标左键拖动

删除:右键菜单delete

调整:右键菜单adjust，精确改变帧对应的时间。



## 工具栏

![image-20201120123528325](/src/assets/markdown/image-20201120123528325.png)

从上到下分别是:

* [x] 选择

  目前主要是用于拖动插入的图片。未来将会有更多功能 待更新.......

* [x] 钢笔

  钢笔状态下也可以拖动图片。但注意:图片必须在画布之外

* [x] 染料桶

* [x] 颜色选择

* [x] 撤回

* [x] 前进

* [x] 插入图片

  插入后的图片可放大,缩小,调整尺寸

* [x] 预览动画

* [x] 导出css代码

* [x] 调整画布尺寸
