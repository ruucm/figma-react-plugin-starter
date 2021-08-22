import * as randomColor from "randomcolor"
import * as React from "react"
import * as ReactDOM from "react-dom"
import "./ui.scss"

interface Props {}

interface State {
  colors: string[]
  isItemSelected: boolean
  isColorGenerated: boolean
}

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      colors: ["#fff", "#fff", "#fff"],
      isItemSelected: false,
      isColorGenerated: false,
    }
  }

  componentDidMount() {
    window.onmessage = (msg) => {
      const { type } = msg.data.pluginMessage
      if (type === "ITEM_SELECTED") {
        this.setState({ isItemSelected: true })
      } else if (type === "ITEM_NOT_SELECTED") {
        this.setState({ isItemSelected: false })
      }
    }
  }

  sendMessage = (type, data = null) => {
    parent.postMessage(
      {
        pluginMessage: {
          type,
          data,
        },
      },
      "*"
    )
  }

  mapValues = (x) => {
    return ((x - 0) * (1 - 0)) / (255 - 0) + 0
  }

  getRGBValues = (str) => {
    var vals = str.substring(str.indexOf("(") + 1, str.length - 1).split(", ")
    return {
      r: this.mapValues(parseInt(vals[0])),
      g: this.mapValues(parseInt(vals[1])),
      b: this.mapValues(parseInt(vals[2])),
    }
  }

  generateColors = () => {
    const colors = randomColor({ count: 3, format: "rgb", hue: "random" })
    this.setState({ colors, isColorGenerated: true })
  }

  assignColor = (color) => {
    this.sendMessage("ASSIGN_COLOR", this.getRGBValues(color))
  }

  render() {
    const { isItemSelected, isColorGenerated, colors } = this.state
    return (
      <div className="app">
        <div className="colors">
          {colors.map((color, i) => (
            <button
              key={`${i}-${color}`}
              type="button"
              className="color"
              onClick={
                isItemSelected && isColorGenerated
                  ? () => this.assignColor(color)
                  : null
              }
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button type="button" onClick={this.generateColors}>
          Generate color
        </button>
        {!isItemSelected && <div className="alert">Select an Item.</div>}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"))
