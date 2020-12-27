# weather-cal

<img src="https://github.com/meganmakela/weather-cal/blob/main/Weather%20Cal/example_light.PNG" width="300"> <img src="https://github.com/meganmakela/weather-cal/blob/main/Weather%20Cal/example_dark.PNG" width="300">

Scriptable widget based on [Weather Cal](https://github.com/mzeryck/Weather-Cal). Uses date, calendar, battery, and greeting elements. Uses the "custom" object in the Weather Cal container script to add a dynamic background for dark mode, screen brightness, Apple Health (average heart rate) and Activity data (active calories, exercise minutes, stand hours) from a .csv file in iCloud created using auto-sync from the app [Health Auto Export](https://www.healthexportapp.com/).

## Set-up 
1. Set-up the the vanilla Weather-Cal script and widget first. Instructions are on the original dev's page [here](https://github.com/mzeryck/Weather-Cal#Setup).
2. For the light and dark mode background images, save images as "Weather Cal-light" and "Weather Cal-dark" in the /iCloud Drive/Scriptable/Weather Cal folder created during inital set-up.
    * If you don't want to use this, you can comment out or delete the background method in the custom object and it will default to the background setting of the widget. 
2. Install the [Health Auto Export app](https://apps.apple.com/us/app/health-auto-export-to-csv/id1115567069) from the App Store.
    * This is a paid app ($1.99). A free trial is available from the [developer](https://www.healthexportapp.com/free-trial) through TestFlight, but using it has not been tested. 
3. Enable "Automated Backups" in the Auto Health Export App and click "Sync Now" to create the file structure for backed up data in iCloud Drive. 
    * Please read the developer FAQ page for details about frequency, privacy, etc. related to the backups. 
4. In Scriptable settings, go to "File Bookmarks" and create a bookmark for the "Health Export" folder in iCloud Drive.
    * Make sure to name the bookmark "Health Export".
  
## Items
In addition to the widget items in the Weather Cal script, the custom object here adds a dynamic background that changes when using the Dark appareance setting; "batterybright" item for displaying battery level and screen brightness device parameters; "health" item for displaying active calories, exercise minutes, stand hours, (optionally steps); and "heart" item for displaying the last recorded average heart rate. 
