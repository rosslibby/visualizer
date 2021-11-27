const allStyles = ['bars',
'bars blocks',
'big bars',
'cubes',
'dualbars',
'dualbars blocks',
'fireworks',
'flower',
'flower blocks',
'orbs',
'ring',
'rings',
'round wave',
'shine',
'shine rings',
'shockwave',
'star',
'static',
'stitches',
'web',
'wave']

class Controller {
  constructor() {
    this.wave = new Wave()
    this.previousWave = new Wave()
    this.nextWave = new Wave()
    this.waves = {}
    this.style = 'bars'
    this.styles = allStyles

    allStyles.forEach(style => this.waves[style] = new Wave())
  }

  init() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.previousWave.fromStream(stream, 'visualizer-previous', {
          type: 'wave',
          colors: ['rgb(157, 0, 255)', 'rgb(255, 55, 188)', 'rgb(255, 55, 55)', 'rgb(238, 255, 96)', 'rgb(0, 255, 66)', 'rgb(0, 253, 255)', 'rgb(2, 45, 25)']
        }, false)
        this.wave.fromStream(stream, 'visualizer', {
          type: 'bars',
          colors: ['rgb(157, 0, 255)', 'rgb(255, 55, 188)', 'rgb(255, 55, 55)', 'rgb(238, 255, 96)', 'rgb(0, 255, 66)', 'rgb(0, 253, 255)', 'rgb(2, 45, 25)']
        }, false)
        this.nextWave.fromStream(stream, 'visualizer-next', {
          type: 'bars blocks',
          colors: ['rgb(157, 0, 255)', 'rgb(255, 55, 188)', 'rgb(255, 55, 55)', 'rgb(238, 255, 96)', 'rgb(0, 255, 66)', 'rgb(0, 253, 255)', 'rgb(2, 45, 25)']
        }, false)
      })
      .catch(err => console.error(err.message))
  }

  setStyle(index) {
    this.style = this.styles[index]
  }

  getStyle() {
    return {
      index: this.styles.indexOf(this.style),
      style: this.style
    }
  }

  swipe(direction) {
    const currentStyle = this.getStyle().index

    if (direction === 'left') {
      if (currentStyle === 0) {
        this.setStyle(this.styles.length - 1)
      } else {
        this.setStyle(currentStyle - 1)
      }
    } else {
      if (currentStyle === this.styles.length - 1) {
        this.setStyle(0)
      } else {
        this.setStyle(currentStyle + 1)
      }
    }

    const selectedStyle = this.getStyle().style

    /**
     * Update visualizer with selected style
     */
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        let initialPreviousVisualizer
        let previousVisualizer
        let nextVisualizer
        const selectedStyleIndex = this.styles.indexOf(selectedStyle)

        if (currentStyle === 0) {
          initialPreviousVisualizer = this.styles.length - 1
        } else {
          initialPreviousVisualizer = currentStyle - 1
        }

        if (selectedStyleIndex === 0) {
          previousVisualizer = this.styles.length - 1
        } else {
          previousVisualizer = selectedStyleIndex - 1
        }

        if (selectedStyleIndex === this.styles.length - 1) {
          nextVisualizer = 0
        } else {
          nextVisualizer = selectedStyleIndex + 1
        }

        setTimeout(() => {
          this.wave.fromStream(stream, 'visualizer', {
            type: selectedStyle,
            colors: ['rgb(157, 0, 255)', 'rgb(255, 55, 188)', 'rgb(255, 55, 55)', 'rgb(238, 255, 96)', 'rgb(0, 255, 66)', 'rgb(0, 253, 255)', 'rgb(2, 45, 25)']
          }, false)
        }, 450)

        setTimeout(() => {
          this.previousWave.fromStream(stream, 'visualizer-previous', {
            type: this.styles[previousVisualizer],
            colors: ['rgb(157, 0, 255)', 'rgb(255, 55, 188)', 'rgb(255, 55, 55)', 'rgb(238, 255, 96)', 'rgb(0, 255, 66)', 'rgb(0, 253, 255)', 'rgb(2, 45, 25)']
          }, false)
          this.nextWave.fromStream(stream, 'visualizer-next', {
            type: this.styles[nextVisualizer],
            colors: ['rgb(157, 0, 255)', 'rgb(255, 55, 188)', 'rgb(255, 55, 55)', 'rgb(238, 255, 96)', 'rgb(0, 255, 66)', 'rgb(0, 253, 255)', 'rgb(2, 45, 25)']
          }, false)
        }, 500)
      })
      .catch(err => console.error(err.message))

    return this.getStyle()
  }
}

const styleController = new Controller()

const init = () => {
  const startButton = document.getElementById('start-button')
  startButton.parentElement.removeChild(startButton)

  document.removeEventListener('click', init)
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {}
  }

  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = constraints => {
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

      if (!getUserMedia) {
        return Promise.reject(new Error(`getUserMedia is not implemented in this browser`))
      }

      return new Promise((resolve, reject) => getUserMedia.call(navigator, constraints, resolve, reject))
    }
  }

  styleController.init()
}

document.addEventListener('click', init)

const goToNext = () => {
  const nextWrapper = document.querySelector('.visualizer-wrapper--previous')
  nextWrapper.classList.add('slide-previous')
  setTimeout(() => {
    nextWrapper.classList.remove('slide-previous')
  }, 500)
  styleController.swipe('left')
}

const goToPrevious = () => {
  const previousWrapper = document.querySelector('.visualizer-wrapper--next')
  previousWrapper.classList.add('slide-next')
  setTimeout(() => {
    previousWrapper.classList.remove('slide-next')
  }, 500)
  styleController.swipe('right')
}

let touchStartX = 0
let touchEndX = 0

document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX
}, false)

document.addEventListener('touchmove', e => {
  touchEndX = e.touches[0].clientX
}, false)

document.addEventListener('touchend', e => {
  if (touchEndX < touchStartX - 20) {
    goToPrevious()
  } else if (touchEndX > touchStartX + 20) {
    goToNext()
  }
})

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    goToNext()
  } else if (e.key === 'ArrowRight') {
    goToPrevious()
  }
})