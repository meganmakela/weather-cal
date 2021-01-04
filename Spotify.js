// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
let spotifyCredentials
let widget = await createWidget()
Script.setWidget(widget)
Script.complete()

async function createWidget() {

    let widget = new ListWidget()
    let spotifyIcon = await getImage("spotify-icon.png")

    if (Device.isUsingDarkAppearance()) {
    	widget.backgroundColor = new Color("#121212")
      var textColor = "#B3B3B3"
    } else 
    widget.backgroundColor = new Color("#FFFFFF")
    var textColor = "#404040"

    // load spotify credentials from iCloud Drive
    spotifyCredentials = await loadSpotifyCredentials()
    if(spotifyCredentials != null) {
      widget.url = "spotify://"
      let nowPlaying = await loadNowPlaying()
      if(nowPlaying != null) {
        widget.setPadding(20,12, 8, 8)
        let cleanTitle = nowPlaying.item.name.split(" (")[0]
        cleanTitle = cleanTitle.split(" - ")[0]
        const artist = nowPlaying.item.artists[0].name
        // console.log("Now Playing: " + cleanTitle + " - " + artist)
        
        // cover art
        const coverUrl = nowPlaying.item.album.images[0].url
        let coverImage = await loadImage(coverUrl)

        let row = widget.addStack()
        let stack = row.addStack()
        stack.layoutHorizontally()
        stack.size = new Size(105,105)
        
        let cover = stack.addImage(coverImage)
        cover.cornerRadius = 6
        cover.borderColor = new Color("#1DB954")
        cover.borderWidth = 3
        stack.addSpacer(10)
        
        let stack2 = row.addStack()
        stack2.layoutVertically()
        
        let spotifyIconImage = stack2.addImage(spotifyIcon)
        stack2.addSpacer(10)
        
        let shuffleIcon = await getImage("shuffle-icon.png")
        let shuffleIconImage = stack2.addImage(shuffleIcon)
        if(nowPlaying.shuffle_state == true) {
          shuffleIconImage.imageOpacity = 1
        } else {
          shuffleIconImage.imageOpacity = 0.3
        }
        
        let repeatIcon = await getImage("repeat-icon.png")
        stack2.addSpacer(10)
        let repeatIconImage = stack2.addImage(repeatIcon)
        if(nowPlaying.repeat_state === "off") {
          repeatIconImage.imageOpacity = 0.3
        } else {
          repeatIconImage.imageOpacity = 1.0
        }
        
        // add title and artist
        let titleTxt = widget.addText(cleanTitle)
        titleTxt.font = Font.semiboldSystemFont(11)
        titleTxt.textColor = new Color(textColor)
        titleTxt.lineLimit = 1
        widget.addSpacer(2)
    
        let artistTxt = widget.addText(artist)
        artistTxt.font = Font.boldSystemFont(11)
        artistTxt.textColor = new Color("#1DB954")
        artistTxt.lineLimit = 1
            
        widget.addSpacer()
        
      } else {
        // Spotify playback stopped
        let spotifyImage = widget.addImage(spotifyIcon)
        spotifyImage.imageSize = new Size(25,25)
        spotifyImage.rightAlignImage()
        widget.addSpacer(10)
       
        let offIcon = await getImage("offline-icon.png")
        let offImage = widget.addImage(offIcon)
        offImage.imageSize = new Size(50,50)
        offImage.centerAlignImage()
        widget.addSpacer(5)
        
        let playbackText = widget.addText("Playback stopped")
        playbackText.font = Font.semiboldSystemFont(11)
        playbackText.textColor =  new Color(textColor)
        playbackText.centerAlignText()
        widget.addSpacer()
      }
    } else {
      // no credentials found
      let spotifyImage = widget.addImage(spotifyIcon)
      spotifyImage.imageSize = new Size(25,25)
      spotifyImage.rightAlignImage()
      widget.addSpacer(10)
      console.log("Could not find Spotify credentials!")
      let ts = widget.addText("Couldn't find your spotify credentials in iCloud Drive. \n\n Please tap me for setup instructions.")
      ts.textColor = new Color(textColor)
      ts.font = Font.boldSystemFont(11)
      ts.leftAlignText()
      widget.url = "https://gist.github.com/marco79cgn/79a6a265d978dc22cc2a12058b24e02b#gistcomment-3469230"
    }

    return widget
}

// get nowPlaying via Spotify Web API
async function loadNowPlaying() {
    const req = new Request("https://api.spotify.com/v1/me/player")
    req.headers = { "Authorization": "Bearer " + spotifyCredentials.accessToken, "Content-Type": "application/json" }
    let npResult = await req.load()
    if (req.response.statusCode == 401) {
      // access token expired, trying to refresh
      let success = await refreshSpotifyAccessToken()
      if(success) {
        return await loadNowPlaying()
      } else {
        return null
      }
    } else if (req.response.statusCode == 204) {
      // no playback
      return null
    } else if (req.response.statusCode == 200) {
      npResult = JSON.parse(npResult.toRawString()) 
    }
    return npResult
}

// load and validate spotify credentials from iCloud Drive
async function loadSpotifyCredentials() {
    let fm = FileManager.iCloud()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, "spotify-credentials.json")
    let spotifyCredentials
    if(fm.fileExists(path)) {
      await fm.downloadFileFromiCloud(path)
      let spotifyCredentialsFile = Data.fromFile(path)
      spotifyCredentials = JSON.parse(spotifyCredentialsFile.toRawString())
      if (isNotEmpty(spotifyCredentials.clientId) 
        && isNotEmpty(spotifyCredentials.clientSecret) 
          && isNotEmpty(spotifyCredentials.accessToken) 
            && isNotEmpty(spotifyCredentials.refreshToken)) {
              return spotifyCredentials
      }
    }
    return null
}

// helper function to check not empty strings
function isNotEmpty(stringToCheck) {
  if (stringToCheck != null && stringToCheck.length > 0) {
    return true
  } else {
    return false
  }
}

// The Spotify access token expired so we get a new one by using the refresh token (Authorization Flow)
async function refreshSpotifyAccessToken() {
  if(spotifyCredentials != null) {
    let req = new Request("https://accounts.spotify.com/api/token")
    req.method = "POST"
    req.headers = { "Content-Type": "application/x-www-form-urlencoded" }
    req.body = "grant_type=refresh_token&refresh_token=" + spotifyCredentials.refreshToken + "&client_id=" + spotifyCredentials.clientId + "&client_secret=" + spotifyCredentials.clientSecret
    let result = await req.loadJSON()
    spotifyCredentials.accessToken = result.access_token
    let fm = FileManager.iCloud()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, "spotify-credentials.json")
    fm.write(path, Data.fromString(JSON.stringify(spotifyCredentials)))
    return true
  }
  return false
  
}

// get images from local filestore or download them once
async function getImage(image) {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, image)
  if(fm.fileExists(path)) {
    return fm.readImage(path)
  } else {
    // download once
    let imageUrl
    switch (image) {
      case 'spotify-icon.png':
        imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/240px-Spotify_logo_without_text.svg.png"
        break
      case 'shuffle-icon.png':
        imageUrl = "https://www.iconsdb.com/icons/download/black/shuffle-128.png"
        break
      case 'repeat-icon.png':
        imageUrl = "https://www.iconsdb.com/icons/download/black/repeat-128.png"
        break
      case 'offline-icon.png':
        imageUrl = "http://cdn.1001freedownloads.com/vector/thumb/98366/clarity-shutdown-icon.png"
        break
      default:
        console.log(`Sorry, couldn't find ${image}.`);
    }
    let iconImage = await loadImage(imageUrl)
    fm.writeImage(path, iconImage)
    return iconImage
  }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}