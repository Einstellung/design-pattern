import { Element } from "./createDom"

let initialIndex = 0
/** diff比较方法 */
const walkDiff = (oldVirtualDom: Element, newVirtualDom: Element, index: number, patches: Record<string, any>) => {
  let diffResult = []

  if(!newVirtualDom) {
    diffResult.push({
      type: "REMOVE",
      index
    })
  }

  if (typeof oldVirtualDom === "string" && typeof newVirtualDom === "string") {
    if (oldVirtualDom !== newVirtualDom) {
      diffResult.push({
        type: "MODIFY_TEXT",
        data: newVirtualDom,
        index
      })
    }
  }

  if(oldVirtualDom.tagName === newVirtualDom.tagName) {
    let diffAttributeResult = []
    for (let key in oldVirtualDom) {
      if (oldVirtualDom[key] !== newVirtualDom[key]) {
        diffAttributeResult[key] = newVirtualDom[key]
      }
    }

    for (let key in newVirtualDom) {
      if (!oldVirtualDom.hasOwnProperty(key)) {
        diffAttributeResult[key] = newVirtualDom[key]
      }
    }

    if(Object.keys(diffAttributeResult).length > 0) {
      diffResult.push({
        type: "MODIFY_ATTRIBUTES",
        diffAttributeResult
      })
    }

    oldVirtualDom.chidren.forEach((child, index) => {
      walkDiff(child, newVirtualDom.chidren[index], ++initialIndex, patches)
    })
  }
  
  else {
    diffResult.push({
      type: "REPLACE",
      newVirtualDom
    })
  }

  if (!oldVirtualDom) {
    diffResult.push({
      type: "REPLACE",
      newVirtualDom
    })
  }

  if(diffResult.length) {
    patches[index] = diffResult
  }
}

const doPatch = (node: HTMLElement, patches: Record<string, any>) => {
  patches.forEach(patch => {
    switch (patch.type) {
      case "MODIFY_ATTRIBUTES":
        const attributes = patch.diffAttributeResult.attributes
        for (let key in attributes) {
          if (node.nodeType !== 1) return
          const value = attributes[key]
          if (value) {
            node.setAttribute(key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case "MODIFY_TEXT":
        node.textContent = patch.data
        break
      case "REPLACE":
        let newNode = (patch.newNode instanceof Element) 
        ? patch.newNode.render()
        : document.createTextNode(patch.newNode)

        node.parentNode.replaceChild(newNode, node)
        break
      case "REMOVE":
        node.parentNode.removeChild(node)
        break
      default:
        break
    }
  })
}