/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

figma.showUI(__html__)
figma.ui.onmessage = (msg) => {
  const { type } = msg
  if (type === "ASSIGN_COLOR") {
    const { selection } = figma.currentPage
    const { data } = msg
    const fills = clone((selection[0] as any).fills)

    fills[0].color = data
    ;(selection[0] as any).fills = fills
  }
}

figma.on("selectionchange", () => {
  detectSelection()
})

const detectSelection = () => {
  const { selection } = figma.currentPage
  console.log("selection", selection)
  if (selection.length) {
    figma.ui.postMessage({ type: "ITEM_SELECTED" })
  } else {
    figma.ui.postMessage({ type: "ITEM_NOT_SELECTED" })
  }
}

const clone = (val) => {
  return JSON.parse(JSON.stringify(val))
}

detectSelection()
