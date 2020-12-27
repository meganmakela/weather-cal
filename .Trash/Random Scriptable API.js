// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: book;
// This script shows a random Scriptable API in a widget. The script is meant to be used with a widget configured on the Home Screen.
// You can run the script in the app to preview the widget or you can go to the Home Screen, add a new Scriptable widget and configure the widget to run this script.
// You can also try creating a shortcut that runs this script. Running the shortcut will show widget.
let api = await randomAPI()
let widget = await createWidget(api)
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
  let appIcon = await loadAppIcon()
  let title = "Random Scriptable API"
  let widget = new ListWidget()
  // Add background gradient
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("141414"),
    new Color("13233F")
  ]
  widget.backgroundGradient = gradient
  // Show app icon and title
  let titleStack = widget.addStack()
  let appIconElement = titleStack.addImage(appIcon)
  appIconElement.imageSize = new Size(15, 15)
  appIconElement.cornerRadius = 4
  titleStack.addSpacer(4)
  let titleElement = titleStack.addText(title)
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(13)
  widget.addSpacer(12)
  // Show API
  let nameElement = widget.addText(api.name)
  nameElement.textColor = Color.white()
  nameElement.font = Font.boldSystemFont(18)
  widget.addSpacer(2)
  let descriptionElement = widget.addText(api.description)
  descriptionElement.minimumScaleFactor = 0.5
  descriptionElement.textColor = Color.white()
  descriptionElement.font = Font.systemFont(18)
  // UI presented in Siri ans Shortcuta is non-interactive, so we only show the footer when not running the script from Siri.
  if (!config.runsWithSiri) {
    widget.addSpacer(8)
    // Add button to open documentation
    let linkSymbol = SFSymbol.named("arrow.up.forward")
    let footerStack = widget.addStack()
    let linkStack = footerStack.addStack()
    linkStack.centerAlignContent()
    linkStack.url = api.url
    let linkElement = linkStack.addText("Read more")
    linkElement.font = Font.mediumSystemFont(13)
    linkElement.textColor = Color.blue()
    linkStack.addSpacer(3)
    let linkSymbolElement = linkStack.addImage(linkSymbol.image)
    linkSymbolElement.imageSize = new Size(11, 11)
    linkSymbolElement.tintColor = Color.blue()
    footerStack.addSpacer()
    // Add link to documentation
    let docsSymbol = SFSymbol.named("book")
    let docsElement = footerStack.addImage(docsSymbol.image)
    docsElement.imageSize = new Size(20, 20)
    docsElement.tintColor = Color.white()
    docsElement.imageOpacity = 0.5
    docsElement.url = "https://docs.scriptable.app"
  }
  return widget
}

async function randomAPI() {
  let docs = await loadDocs()
  let apiNames = Object.keys(docs)
  let num = Math.round(Math.random() * apiNames.length)
  let apiName = apiNames[num]
  let api = docs[apiName]
  return {
    name: apiName,
    description: api["!doc"],
    url: api["!url"]
  }
}

async function loadDocs() {
  let url = "https://docs.scriptable.app/scriptable.json"
  let req = new Request(url)
  return await req.loadJSON()
}

async function loadAppIcon() {
  let url = "https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/21/1e/13/211e13de-2e74-4221-f7db-d6d2c53b4323/AppIcon-1x_U007emarketing-0-7-0-85-220.png/540x540sr.jpg"
  let req = new Request(url)
  return req.loadImage()
}