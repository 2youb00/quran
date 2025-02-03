export class AudioPlayer {
    constructor() {
      this.audio = new Audio()
      this.isPlaying = false
      this.currentAyah = null
    }
  
    play(url, ayahNumber) {
      if (this.currentAyah === ayahNumber && this.isPlaying) {
        this.pause()
        return
      }
  
      if (this.currentAyah !== ayahNumber) {
        this.audio.src = url
        this.currentAyah = ayahNumber
      }
  
      this.audio.play()
      this.isPlaying = true
    }
  
    pause() {
      this.audio.pause()
      this.isPlaying = false
    }
  
    stop() {
      this.audio.pause()
      this.audio.currentTime = 0
      this.isPlaying = false
      this.currentAyah = null
    }
  }
  
  export const audioPlayer = new AudioPlayer()
  
  