export const RenderPosition = {
  'AFTERBEGIN': `afterbegin`,
  'BEFOREEND': `beforeend`,
  'BEFOREBEGIN': `beforebegin`
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};
export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.BEFOREBEGIN:
      container.before(component.getElement());
      break;
    default:
      throw new Error(`Unknown render position`);
  }
};
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
export const replace = (newComponent, oldComponent) => {
  replaceElement(newComponent.getElement(), oldComponent.getElement());
};
export const replaceElement = (newElement, oldElement) => {
  const parentElement = oldElement.parentElement;

  const isExist = !!(parentElement && newElement && oldElement);
  if (isExist && parentElement.contains(oldElement)) {
    const {scrollTop, scrollLeft} = oldElement;

    newElement.style.animationDuration = `0s`;

    parentElement.replaceChild(newElement, oldElement);

    newElement.scrollLeft = scrollLeft;
    newElement.scrollTop = scrollTop;
  }
};
