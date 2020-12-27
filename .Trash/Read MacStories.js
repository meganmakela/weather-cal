// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: newspaper;
// This script shows articles from MacStories. The script can be used either in the app, as a widget on your Home Screen or through Shortcuts. The behaviour of the script will vary slightly depending on where it's used.
let items = await loadItems()
if (config.runsInWidget) {
  // Tell the widget on the Home Screen to show our ListWidget instance.
  let widget = await createWidget(items)
  Script.setWidget(widget)
} else if (config.runsWithSiri) {
  // Present a table with a subset of the news.
  let firstItems = items.slice(0, 5)
  let table = createTable(firstItems)
  await QuickLook.present(table)
} else {
  // Present the full list of news.
  let table = createTable(items)
  await QuickLook.present(table)
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(items) {
  let item = items[0]
  let authors = item.authors.map(a => {
    return a.name
  }).join(", ")
  let imgURL = extractImageURL(item)
  let rawDate = item["date_published"]
  let date = new Date(Date.parse(rawDate))
  let dateFormatter = new DateFormatter()
  dateFormatter.useMediumDateStyle()
  dateFormatter.useShortTimeStyle()
  let strDate = dateFormatter.string(date)
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("#b00a0fe6"),
    new Color("#b00a0fb3")
  ]
  let widget = new ListWidget()
  if (imgURL != null) {
    let imgReq = new Request(imgURL)
    let img = await imgReq.loadImage()
    widget.backgroundImage = img
  }
  widget.backgroundColor = new Color("#b00a0f")
  widget.backgroundGradient = gradient
  // Add spacer above content to center it vertically.
  widget.addSpacer()
  // Show article headline.
  let title = decode(item.title)
  let titleElement = widget.addText(title)
  titleElement.font = Font.boldSystemFont(16)
  titleElement.textColor = Color.white()
  titleElement.minimumScaleFactor = 0.75
  // Add spacing below headline.
  widget.addSpacer(8)
  // Add footer woth authors and date.
  let footerStack = widget.addStack()
  let authorsElement = footerStack.addText(authors)
  authorsElement.font = Font.mediumSystemFont(12)
  authorsElement.textColor = Color.white()
  authorsElement.textOpacity = 0.9
  footerStack.addSpacer()
  let dateElement = footerStack.addText(strDate)
  dateElement.font = Font.mediumSystemFont(12)
  dateElement.textColor = Color.white()
  dateElement.textOpacity = 0.9
  // Add spacing below content to center it vertically.
  widget.addSpacer()
  // Set URL to open when tapping widget.
  widget.url = item.url
  return widget
}

function createTable(items) {
  let table = new UITable()
  for (item of items) {
    let row = new UITableRow()
    let imageURL = extractImageURL(item)
    let title = decode(item.title)
    let imageCell = row.addImageAtURL(imageURL)
    let titleCell = row.addText(title)
    imageCell.widthWeight = 20
    titleCell.widthWeight = 80
    row.height = 60
    row.cellSpacing = 10
    row.onSelect = (idx) => {
      let item = items[idx]
      Safari.open(item.url)
    }
    row.dismissOnSelect = false
    table.addRow(row)
  }
  return table
}
  
async function loadItems() {
  let url = "https://macstories.net/feed/json"
  let req = new Request(url)
  let json = await req.loadJSON()
  return json.items
}

function extractImageURL(item) {
  let regex = /<img src="(.*)" alt="/
  let html = item["content_html"]
  let matches = html.match(regex)
  if (matches && matches.length >= 2) {
    return matches[1]
  } else {
    return null
  }
}

function decode(str) {
  let regex = /&#(\d+);/g
  return str.replace(regex, (match, dec) => {
    return String.fromCharCode(dec)
  })
}