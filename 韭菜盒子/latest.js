//
// 通用框架插件模版代码
// 项目地址：https://github.com/im3x/Scriptables
//

class Im3xWidget {
  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor(arg) {
    this.arg = arg
    this.fileName = module.filename.split('Documents/')[1]
    this.widgetSize = config.widgetFamily
  }
  /**
   * 渲染组件
   */
  async render() {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall() {
    let w = new ListWidget()
    w.addText("不支持尺寸")
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium() {
    let w = new ListWidget()
    w.addText("不支持尺寸")
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge() {
    let w = new ListWidget()
    let data = await this.getData()

    w.addSpacer(10)
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 5; i ++) {
      w = await this.renderCell(w, data[i])
      w.addSpacer(10)
    }

    return w
  }

  /**
   * 渲染标题
   * @param widget 组件对象
   * @param icon 图标url地址
   * @param title 标题
   */
  async renderHeader (widget, customStyle = true) {
    let _title = "韭菜盒子"

    let header = widget.addStack()
    header.centerAlignContent()
    let title = header.addText(_title)
    if (customStyle) title.textColor = Color.white()
    title.textOpacity = 0.7
    title.font = Font.boldSystemFont(14)
    
    widget.addSpacer(15)
    return widget
  }

  /**
   * 获取api数据
   * @param api api地址
   * @param json 接口数据是否是 json 格式，如果不是（纯text)，则传递 false
   * @return 数据 || null
   */
  async getData(api, json = true) {
    let code = this.arg.split(',')
    let funds = [];

    code.forEach(element => {
      let api = `http://fundgz.1234567.com.cn/js/${element}.js`
      let req = new Request(api)
      let res = await req.loadString()
      let fund = JSON.parse(res.substring(8, res.length - 2))
      funds.push(fund);
    });

    return funds
  }

  async renderCell (widget, fund) {
    let body = widget.addStack()
    body.url = topic['url']
    let isUp = fund['gszzl'] > 0

    let left = body.addStack()
    let icon = left.addText(isUp ? '↑' : '↓')
    icon.textColor = isUp ? new Color('#FF0000') : new Color('#008000')
    icon.font = Font.lightSystemFont(14)

    body.addSpacer(40)

    let mid = body.addStack()
    mid.layoutVertically()
    let gszzl = mid.addText(`${fund['gszzl']}%`)
    gszzl.textColor = isUp ? new Color('#FF0000') : new Color('#008000')
    gszzl.font = Font.lightSystemFont(14)

    body.addSpacer(40)

    let right = body.addStack()
    right.layoutVertically()
    let name = right.addText(fund['name'])
    name.textColor = isUp ? new Color('#FF0000') : new Color('#008000')
    name.font = Font.lightSystemFont(14)

    widget.addSpacer(10)

    return widget
  }

  /**
   * 编辑测试使用
   */
  async test() {
    if (config.runsInWidget) return
    this.widgetSize = 'small'
    let w1 = await this.render()
    await w1.presentSmall()
    this.widgetSize = 'medium'
    let w2 = await this.render()
    await w2.presentMedium()
    this.widgetSize = 'large'
    let w3 = await this.render()
    await w3.presentLarge()
  }

  /**
   * 组件单独在桌面运行时调用
   */
  async init() {
    if (!config.runsInWidget) return
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Im3xWidget('').test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
// await new Im3xWidget(args.widgetParameter).init()
