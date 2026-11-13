(() => {
  'use strict';
  const projects = [
    {id:'archives',title:'Les Archives France',category:'Капсула одежды',description:'Цирк, шумные вечеринки, воланы и полоска. Капсула, в которой чувствуется любовь Полины к игре и переодеваниям.',detail:'Chin-chin! Надпись от руки стала частью самой вещи.',images:[['laf2.jpg','Образ из капсулы Chin-chin!'],['laf1.jpg','Детали капсулы Les Archives France']],url:'https://www.instagram.com/les_archives_france/'},
    {id:'flowers',title:'Why Not Flowers',category:'Авторские букеты',description:'Одна из первых коллабораций Полины. Букеты к 8 Марта и личные послания, спрятанные среди цветов.',detail:'Карточка Pantone и специально подобранный трек продолжали настроение букета.',images:[['wnf2.jpg','Полина с букетами Why Not Flowers'],['wnf1.jpg','Мимоза и карточка с посланием']],url:'https://www.instagram.com/whynot.flowers/'},
    {id:'bynotem',title:'Bynotem',category:'Свечи и спички',description:'Яркие свечи, похожие на конфеты. Праздничная коллекция с личным ритуалом: записать мысли и отпустить их.',detail:'К свечам придумали собственные спички и бумагу для записок.',images:[['bn2.jpg','Полина с праздничными свечами Bynotem'],['bn1.jpg','Цветные свечи и спички из коллаборации']],url:'https://www.instagram.com/bynotem/'},
    {id:'love',title:'Без рецепта',category:'Шоколадная коллекция «Любовь»',description:'Коробка конфет ко Дню святого Валентина. Четыре вкуса, каждый со своим именем и настроением.',detail:'Взаимная, нежная, неразделённая и первая.',images:[['br1.jpg','Коробка конфет Любовь'],['br2.jpg','Шоколадные конфеты из коллекции Любовь']],url:'https://www.instagram.com/bez_recepta/'},
    {id:'flame',title:'Flame Moscow',category:'Свечи «Гори и грей»',description:'Семь ароматов, посвящённых детским воспоминаниям Полины. Дом, знакомые истории и настроение, которое хочется сохранить.',detail:'У каждого аромата своя песня, доступная по QR-коду на свече.',images:[['fl1.jpg','Свеча Гори и грей с фотографиями и личными предметами'],['fl2.jpg','Ароматическая свеча Flame Moscow']],url:'https://www.instagram.com/flame.moscow/'},
    {id:'bshushu',title:'Bshushu',category:'Авторское меню, лето 2023',description:'Совместное меню с шеф-поваром ресторана израильской кухни. Летний проект о том, как чувствовать себя дома в любом городе.',detail:'Встреча вкуса, гостеприимства и личных воспоминаний.',images:[['bs1.jpg','Полина в ресторане Bshushu'],['bs2.jpg','Стол с цветами и блюдами авторского меню']],url:'https://www.instagram.com/bshushu.moscow/'},
    {id:'school',title:'Department of Aesthetics',category:'Авторский образовательный проект',description:'Онлайн-курс о контенте, творческой работе и внимании к повседневной красоте. По данным авторов, обучение прошли более 5000 человек.',detail:'Для тех, кто хочет не только создавать, но и замечать.',images:[['doa1.jpg','Фирменные детали Department of Aesthetics'],['doa2.jpg','Полина с материалами образовательного проекта']],url:'https://www.instagram.com/department.of.aesthetics/'}
  ];
  const dialog = document.querySelector('#project-dialog');
  const title = document.querySelector('#dialog-title');
  const category = document.querySelector('#dialog-category');
  const description = document.querySelector('#dialog-description');
  const detail = document.querySelector('#dialog-detail');
  const imageArea = document.querySelector('#dialog-images');
  const link = document.querySelector('#dialog-link');
  const position = document.querySelector('#project-position');
  const closeButton = document.querySelector('.dialog-close');
  let currentIndex = 0;
  let lastTrigger = null;
  function showProject(index, trigger) {
    currentIndex = (index + projects.length) % projects.length;
    const project = projects[currentIndex];
    title.textContent = project.title;
    category.textContent = project.category;
    description.textContent = project.description;
    detail.textContent = project.detail;
    link.href = project.url;
    position.textContent = project.title;
    imageArea.replaceChildren(...project.images.map(([file,alt]) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = 'img/' + file;
      img.alt = alt;
      img.width = 1000;
      img.height = 1250;
      img.decoding = 'async';
      img.addEventListener('error', () => {
        const fallback = document.createElement('p');
        fallback.className = 'image-fallback';
        fallback.textContent = 'Фотография не загрузилась. Посмотрите её на странице проекта.';
        figure.replaceChildren(fallback);
      }, {once:true});
      figure.append(img);
      return figure;
    }));
    if (trigger) lastTrigger = trigger;
    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add('dialog-open');
      closeButton.focus({preventScroll:true});
    }
    dialog.scrollTop = 0;
  }
  document.querySelectorAll('[data-project]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const index = projects.findIndex(project => project.id === trigger.dataset.project);
      if (index !== -1) showProject(index,trigger);
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (lastTrigger) lastTrigger.focus({preventScroll:true});
  });
  document.querySelector('#project-next').addEventListener('click', () => showProject(currentIndex + 1));
  document.querySelector('#project-prev').addEventListener('click', () => showProject(currentIndex - 1));
  dialog.addEventListener('keydown',event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); showProject(currentIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showProject(currentIndex - 1); }
  });
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-nav');
  function closeMenu() {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded','false');
    menuButton.textContent = 'Меню';
  }
  menuButton.addEventListener('click',() => {
    const willOpen = mobileMenu.hidden;
    mobileMenu.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded',String(willOpen));
    menuButton.textContent = willOpen ? 'Закрыть' : 'Меню';
  });
  mobileMenu.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click',closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); }
  });
  const mobileViewport = matchMedia('(max-width:767px)');
  mobileViewport.addEventListener('change',() => { if (!mobileViewport.matches) closeMenu(); });
})();
