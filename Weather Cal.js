// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: calendar;
/*
~
Welcome to Weather Cal. Run this script to set up your widget.
Add or remove items from the widget in the layout section below.
You can duplicate this script to create multiple widgets. Make sure to change the name of the script each time.
Happy scripting!
~
*/

// Specify the layout of the widget items.
const layout = `
  
  row 
    column
      date
    column(175)
      right
      batterybright
      health
      heart
  row
    column
      left
      events
      right
      greeting
      
`

/*
 * CODE
 * Be more careful editing this section. 
 * =====================================
 */

// Names of Weather Cal elements.
const codeFilename = "Weather Cal code"
const gitHubUrl = "https://raw.githubusercontent.com/mzeryck/Weather-Cal/main/weather-cal-code.js"

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Determine if the Weather Cal code exists and download if needed.
const pathToCode = files.joinPath(files.documentsDirectory(), codeFilename + ".js")
if (!files.fileExists(pathToCode)) {
  const req = new Request(gitHubUrl)
  const codeString = await req.loadString()
  files.writeString(pathToCode, codeString)
}

// Import the code.
if (iCloudInUse) { await files.downloadFileFromiCloud(pathToCode) }
const code = importModule(codeFilename)
const custom = {
// Custom items and backgrounds can be added here.

  /*bright(column){
    
    const brightStack = code.align(column)
    brightStack.layoutHorizontally()
    brightStack.centerAlignContent()
    //brightStack.setPadding(code.padding/2, code.padding, code.padding/2, code.padding)

    const brightIcon = brightStack.addImage(SFSymbol.named("sun.max").image)
    brightIcon.imageSize = new Size(15,15)

    const brightLevel = Math.round(Device.screenBrightness() * 100)
    code.tintIcon(brightIcon,code.format.battery,true)

    brightStack.addSpacer(code.padding * 0.6)
    code.provideText(brightLevel + "%", brightStack, code.format.battery)

  },*/

  batterybright(column){

    const batterybrightStack = code.align(column)
    batterybrightStack.layoutHorizontally()
    batterybrightStack.centerAlignContent()
    batterybrightStack.setPadding(code.padding/2, code.padding, code.padding/2, code.padding)
//     batterybrightStack.addSpacer()

    //Battery Icon
    const batteryIcon = batterybrightStack.addImage(code.provideBatteryIcon(Device.batteryLevel(),Device.isCharging()))
    batteryIcon.imageSize = new Size(20,20)
    batterybrightStack.addSpacer(code.padding * 0.6)
    //Battery Level
    const batteryLevel = Math.round(Device.batteryLevel() * 100)
    if (batteryLevel > 20 || Device.isCharging() ) { code.tintIcon(batteryIcon,code.format.battery,true) }
    else { batteryIcon.tintColor = Color.red() }
    code.provideText(batteryLevel + "%", batterybrightStack, code.format.battery)

    batterybrightStack.addSpacer(code.padding)
    
    //Bright Icon
    const brightIcon = batterybrightStack.addImage(SFSymbol.named("sun.max").image)
    brightIcon.imageSize = new Size(15,15)
    code.tintIcon(brightIcon,code.format.battery,true)
    batterybrightStack.addSpacer(code.padding * 0.6)

    //Bright Level
    const brightLevel = Math.round(Device.screenBrightness() * 100)
    code.provideText(brightLevel + "%", batterybrightStack, code.format.battery)

//     batterybrightStack.addSpacer()

  },
  
  health(column) {

    const healthStack = code.align(column)
    healthStack.layoutHorizontally()
    healthStack.centerAlignContent()
    healthStack.setPadding(code.padding/2, code.padding, code.padding/2, code.padding)

    //Get date and file path information
    date = new Date()
    var y = String(date.getFullYear());
    var m = String(date.getMonth()+1);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var month = months[m-1];
    var day = String(date.getDate());
    const formatDate = y + "-" + m + "-" + day
    const BM = files.bookmarkedPath("Health Export");
    const filePath = "/" + y + "/" + month + "/" + formatDate
    var healthPath = files.joinPath(BM, filePath)

    //Get activity data 
    const activityPath = files.joinPath(healthPath, String("Active Energy-" + formatDate + ".csv"))
    if (files.fileExists(activityPath)) {
      var activityData = files.readString(activityPath)
    var activity = activityData.split(/[\n,]/)
    //Process CSV
    var activityValues = [];
    for (i = 3; i < activity.length;) {
      activityValues.push(parseFloat(activity[i]));
      i=i+2
    }
    var activitySum = Math.round(activityValues.reduce((a,b)=>{return a+b;}));
    } else {
      var activitySum = "--"
    }
    
    //Get exercise data 
    const exercisePath = files.joinPath(healthPath, String("Apple Exercise Time-" + formatDate + ".csv"))
    if (files.fileExists(exercisePath)){
      var exerciseData = files.readString(exercisePath)
    var exercise = exerciseData.split(/[\n,]/)
    //Process CSV
    var exerciseValues = []
    for (i = 3; i < exercise.length;) {
      exerciseValues.push(parseFloat(exercise[i]));
      i=i+2
    }
    var exerciseSum = Math.round(exerciseValues.reduce((a,b)=>{return a+b;}));
  } else {
    var exerciseSum = "--"
  }

    //Get stand data
    const standPath = files.joinPath(healthPath, String("Apple Stand Hour-" + formatDate + ".csv"))
    if (files.fileExists(standPath)) {
      var standData = files.readString(standPath)
    var stand = standData.split(/[\n,]/)
    //Process CSV 
    var standSum = stand[3]
  } else {
    var standSum = "--"
  }
    
    /*//Get step count
    const stepPath = files.joinPath(healthPath, String("Step Count-" + formatDate + ".csv"))
    var stepData = files.readString(stepPath)
    var step = stepData.split(/[\n,]/)
    //Process CSV
    var stepValues = []
    for (i = 3; i < step.length;) {
      stepValues.push(parseFloat(step[i]));
      i=i+2
    }
    var stepSum = Math.round(stepValues.reduce((a,b)=>{return a+b;}));*/

    const healthIcon = healthStack.addImage(SFSymbol.named("figure.walk").image)
    healthIcon.imageSize = new Size(10,10)
    code.tintIcon(healthIcon,code.format.battery,true)

    healthStack.addSpacer(code.padding * 0.6)

    code.provideText(activitySum + " cal | " + exerciseSum + " min | " + standSum + " hrs", healthStack, code.format.customText)
    //code.provideText(activitySum + "cal | " + exerciseSum + "min | " + standSum + "hrs | " + stepSum + "steps", healthStack, code.format.customText)

 },

 heart(column) {

    const heartStack = code.align(column)
    heartStack.layoutHorizontally()
    heartStack.centerAlignContent()
    heartStack.setPadding(code.padding/2, code.padding, code.padding/2, code.padding)

    const heartIcon = heartStack.addImage(SFSymbol.named("heart.fill").image)
    heartIcon.imageSize = new Size(10,10)
    code.tintIcon(heartIcon,code.format.battery,true)
    heartStack.addSpacer(code.padding * 0.6)

    date = new Date()
    var y = String(date.getFullYear());
    var m = String(date.getMonth()+1);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var month = months[m-1];
    var day = String(date.getDate());
    const formatDate = y + "-" + m + "-" + day
    const BM = files.bookmarkedPath("Health Export");
    const filePath = "/" + y + "/" + month + "/" + formatDate
    var healthPath = files.joinPath(BM, filePath)
    //Get heart data
    const heartPath = files.joinPath(healthPath, String("Heart Rate-" + formatDate + ".csv"))
    if (files.fileExists(heartPath)) {
      var heartData = files.readString(heartPath)
      var heart = heartData.split(/[\n,]/)
      var last = heart.length - 2
      var heartAvg = Math.round(heart[last])
    } else {
      var heartAvg = "--" 
    }
    //Process CSV
    code.provideText(heartAvg + " bpm", heartStack, code.format.customText)

 },

 /*async background(widget) {
  
  //if (!code.data.sun) { await code.setupSunrise() }
  ///const current = code.now.getTime()
  
  //Define file path
  const dirPath = files.joinPath(files.documentsDirectory(), "Weather Cal")

  //Set defualt, 'light' background 
  var path = files.joinPath(dirPath, "Weather Cal-light.jpg")
  //Check if device is using dark mode, use dark image if true
  if (Device.isUsingDarkAppearance()){
    var path = files.joinPath(dirPath, "Weather Cal-dark.jpg")
    return widget.backgroundImage = files.readImage(path)
  }

  return widget.backgroundImage = files.readImage(path)
  
  },*/

}

// Run the initial setup or settings menu.
let preview
if (config.runsInApp) {
  preview = await code.runSetup(Script.name(), iCloudInUse, codeFilename, gitHubUrl)
  if (!preview) return
}

// Set up the widget.
const widget = await code.createWidget(layout, Script.name(), iCloudInUse, custom)
Script.setWidget(widget)

// If we're in app, display the preview.
if (config.runsInApp) {
  if (preview == "small") { widget.presentSmall() }
  else if (preview == "medium") { widget.presentMedium() }
  else { widget.presentLarge() }
}

Script.complete()