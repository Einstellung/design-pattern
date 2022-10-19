export class Element {

  tagName: string
  private attributes: Record<string, string>
  chidren: any[]

  constructor(tagName: string, attributes: Record<string, string>, children: any[]) {
    this.tagName = tagName
    this.attributes = attributes
    this.chidren = children
  }

  private setAttributes(node: HTMLElement, key: string, value: string) {
     switch(key) {
      case "style":
        node.style.cssText = value
        break
      case "value":
        let tagName = node.tagName || ""
        tagName = tagName.toLowerCase()
        if(tagName === "input" || tagName === "textarea") {
          (node as HTMLInputElement | HTMLTextAreaElement).value = value
        } else {
          node.setAttribute(key, value)
        }
        break
      default:
        node.setAttribute(key, value)
        break
     }
  }

  render() {
    let element = document.createElement(this.tagName)
    let attributes = this.attributes

    for (let key in attributes) {
      this.setAttributes(element, key, attributes[key])
    }

    let children = this.chidren
    children.forEach(child => {
      let childElement = child instanceof Element
        ? child.render()
        : document.createTextNode(child)

      element.appendChild(childElement)
    })

    return element
  }
}



const chapterListVirtualDom = new Element("ul", {id: "list"}, [
  new Element("li", {class: "chapter"}, ["chapter1"]),
  new Element("li", {class: "chapter"}, ["chapter2"]),
  new Element("li", {class: "chapter"}, ["chapter3"])
])

const dom = chapterListVirtualDom.render()
console.log("🚀 ~ file: createDom.ts ~ line 61 ~ dom", dom)
document.body.appendChild(dom)