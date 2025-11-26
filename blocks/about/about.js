import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // create a UL to hold the cards
  const ul = document.createElement('ul');

  // treat each direct child of the block as one "card/column"
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // move all children from the original row into the li
    while (row.firstElementChild) li.append(row.firstElementChild);

    // detect structure and add classes:
    // - if the card contains a main heading (h1/h2) and several paragraphs it's a 'card-body'
    // - if a picture is the only child of a div, mark as image
    // - if there's a button-like link, convert to .cards-card-cta
    li.classList.add('cards-card');

    // run through immediate children and classify them
    [...li.children].forEach((child) => {
      if (child.tagName.match(/^H[1-6]$/)) {
        child.classList.add('cards-card-title');
      } else if (child.tagName === 'P' || child.tagName === 'DIV') {
        // paragraphs or generic divs that contain text
        child.classList.add('cards-card-body');
      } else if (child.querySelector && child.querySelector('picture')) {
        // if it contains a picture we put the class on the picture wrapper
        child.classList.add('cards-card-image');
      } else if (child.tagName === 'A' && child.textContent.trim().toLowerCase().includes('button')) {
        // simple heuristic: "Button" text -> CTA
        child.classList.add('cards-card-cta');
      } else if (child.tagName === 'A') {
        // any other anchor that's intended as CTA
        child.classList.add('cards-card-cta');
      }
    });

    ul.append(li);
  });

  // optimize pictures found inside any picture>img (same as your original)
  ul.querySelectorAll('picture > img').forEach((img) => {
    const pic = img.closest('picture');
    pic.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
  });

  // clear original block and append new list
  block.textContent = '';
  block.classList.add('cards'); // helpful base class for CSS
  block.append(ul);
}

