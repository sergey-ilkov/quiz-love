let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);



window.onload = function () {
    initSlider();
};

function initSlider() {
    const divSliderBg = document.querySelector('#slider-bg');

    if (divSliderBg) {



        class SliderBg {
            constructor(divSlider, options) {
                this.divSlider = divSlider;
                this.sliderItems = this.divSlider.querySelectorAll('.slider-bg__item');
                this.arrayImages = [];


                this.objData = {
                    width: 200,
                    height: 260,
                    gap: 0,
                    repeatRow: false,
                    speed: 100,
                }


                Object.assign(this.objData, options);


                this.countCol = 1;
                this.countRow = 1;

                this.translateX;

                this.preloader = document.querySelector('.preloader');


                this.init();
            }

            init() {

                this.setColRow();

                this.getImages();

                if (this.arrayImages.length == 0) {
                    console.log('Info slider: no images for slider');
                    return;
                }

                this.loadImages();


            }

            loadImages() {



                for (let i = 0; i < this.arrayImages.length; i++) {
                    const img = document.createElement('img');
                    img.src = this.arrayImages[i];

                    img.onload = () => {
                        if (this.arrayImages.length - 1 == i) {

                            if (this.preloader) {
                                this.preloader.classList.add('hidden');
                            }

                            this.setStyleSlider();
                            this.addImageToHtml();


                        }
                    }

                }

            }


            setStyleSlider() {


                const screenWidth = window.innerWidth;

                this.objData.speed = screenWidth * 0.04;

                this.divSlider.style.display = 'flex';
                this.divSlider.style.flexDirection = 'column';
                this.divSlider.style.gap = this.objData.gap + 'px';

                this.translateX = ((this.objData.width * this.countCol) + (this.objData.gap * this.countCol)) / 2;

                this.divSlider.style.setProperty('--translateX', `${-this.translateX}px`);
                this.divSlider.style.animation = `slider-animation ${this.objData.speed}s linear infinite`;

            }

            addImageToHtml() {


                this.divSlider.innerHTML = '';

                let html = '';

                const imgWidth = Number(this.objData.width) ? this.objData.width + 'px' : this.objData.width;
                const imgHeight = Number(this.objData.height) ? this.objData.height + 'px' : this.objData.height;


                let counter = 0;
                let countImageCol = this.countCol / 2;
                let currentNumImage = 0;


                for (let row = 0; row < this.countRow; row++) {

                    currentNumImage = countImageCol * row;
                    counter = currentNumImage;

                    if (this.arrayImages.length - (counter + countImageCol) < 0) {

                        counter = 0;
                        currentNumImage = 0;
                    }

                    html += `<div class="images-bg__row" style="display: flex; gap: ${this.objData.gap}px;">`;

                    for (let i = 0; i < this.countCol; i++) {


                        html += `
                        <div class="images-bg__item" style="background-image: url(${this.arrayImages[counter]}); width: ${imgWidth}; height: ${imgHeight}; flex-shrink: 0;"></div>
                        `;

                        counter++;

                        if (counter >= countImageCol + currentNumImage) {
                            counter = currentNumImage;

                        }
                    }

                    html += `</div>`;
                }


                this.divSlider.insertAdjacentHTML('beforeend', html);


            }

            setColRow() {

                const widthWindow = window.innerWidth;
                const heightWindow = window.innerHeight;

                const imageWidth = this.objData.width + this.objData.gap;

                this.countCol = Math.ceil(widthWindow / imageWidth);

                this.countCol *= 2;

                const divHeader = document.querySelector('.header');
                const headerHeight = divHeader.getBoundingClientRect().height;



                this.countRow = Math.ceil((heightWindow - headerHeight) / this.objData.height);

            }

            getImages() {
                const countImages = this.countCol / 2 * this.countRow;

                let counter = 0;

                for (let i = 0; i < countImages; i++) {


                    const src = this.sliderItems[counter].getAttribute('data-image');

                    this.arrayImages.push(src);

                    counter++;

                    if (!this.sliderItems[counter]) {
                        counter = 0;
                    }


                }

            }

        }


        const options = {
            width: 280,
            height: 370,
            gap: 8,

        }

        const sliderBg = new SliderBg(divSliderBg, options);


    }




    const divQuizLove = document.querySelector('#quiz-love');

    if (divQuizLove) {

        divQuizLove.classList.remove('hidden');

        class QuizLove {
            constructor(divQuizLove) {
                this.divQuizLove = divQuizLove;

                this.items = divQuizLove.querySelectorAll('.quiz-love__item');
                this.buttons = divQuizLove.querySelectorAll('.quiz-love__btn');

                this.stepCheckValidation = divQuizLove.querySelectorAll('.quiz-love__item[data-validation]');

                this.itemClassActive = 'active';

                this.stepClassError = 'isError';

                this.objData = {};

                this.init();
            }

            init() {

                this.events();

            }

            events() {
                this.buttons.forEach(btn => {
                    btn.addEventListener('click', () => {

                        const currentStep = btn.closest('.quiz-love__item');

                        if (!this.validateValue(currentStep)) return;

                        this.addDataForm(btn, currentStep);

                        const next = btn.getAttribute('data-next');

                        if (next) {
                            this.nextStep(next);
                        } else {
                            const send = btn.getAttribute('data-send');
                            if (send) {
                                console.log('send');
                                // this.sendData();
                            }
                        }

                    })
                })

                this.stepCheckValidation.forEach(step => {
                    const inputs = step.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.addEventListener('input', () => {
                            this.validateValue(step);
                        })
                    })
                })
            }

            addDataForm(btn, currentStep) {

                const stepName = currentStep.getAttribute('data-step-name');
                if (!stepName) return;

                const question = currentStep.getAttribute('data-question');

                if (question == 'answer') {
                    const value = btn.getAttribute('data-value');
                    this.objData[stepName] = value;

                }

                if (question == 'choose') {

                    const inputs = currentStep.querySelectorAll('input');

                    this.objData[stepName] = [];

                    inputs.forEach(input => {
                        if (input.checked) {
                            this.objData[stepName].push(input.value);
                        }
                    })


                }

                if (question == 'email' || question == 'password') {
                    const value = currentStep.querySelector('input').value;
                    this.objData[stepName] = value;

                }

                if (question == 'birthday') {

                    const selects = currentStep.querySelectorAll('select');

                    this.objData[stepName] = {};

                    selects.forEach(select => {
                        const name = select.getAttribute('name');

                        this.objData[stepName][name] = select.value;
                    })

                }


                if (question == 'country') {
                    const value = currentStep.querySelector('select').value;
                    this.objData[stepName] = value;
                }



            }

            validateValue(currentStep) {



                const validation = currentStep.getAttribute('data-validation');

                if (currentStep && validation) {

                    const inputs = currentStep.querySelectorAll('input');

                    let counter = 0;

                    inputs.forEach(input => {

                        if (input.checked) {
                            counter++;
                        }
                    })

                    if (counter == 0 || counter > validation) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }

                }

                const stepName = currentStep.getAttribute('data-step-name');

                if (stepName) {

                    const input = currentStep.querySelector('input');

                    if (input && input.value.length == 0) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }

                    const select = currentStep.querySelector('select');

                    if (select && select.value.length == 0) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }

                }

                if (stepName == 'email') {

                    const input = currentStep.querySelector('input');

                    if (input.value == '' || !this.validateEmail(input.value)) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }
                }
                if (stepName == 'password') {

                    const input = currentStep.querySelector('input');

                    if (input.value == '' || input.value.length < 6) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }
                }
                if (stepName == 'birthday') {

                    const selects = currentStep.querySelectorAll('select');

                    let error = 0;
                    selects.forEach(select => {
                        if (select.value.length == 0) {
                            error++;
                            return;
                        }
                    })

                    if (error > 0) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }

                }

                if (stepName == 'country') {
                    const select = currentStep.querySelector('select');

                    if (select.value.length == 0) {
                        currentStep.classList.add(this.stepClassError);
                        return false;
                    } else {
                        currentStep.classList.remove(this.stepClassError);
                    }
                }


                return true;
            }

            validateEmail(email) {
                const re = /\S+@\S+\.\S+/;
                return re.test(email);
            };


            nextStep(next) {



                const nextStep = divQuizLove.querySelector(`#${next}`);
                if (nextStep) {

                    this.items.forEach(item => {
                        item.classList.remove(this.itemClassActive);
                    })

                    nextStep.classList.add(this.itemClassActive);

                }
            }

            // sendData() {

            //     console.log('Obj send');
            //     console.log(this.objData);

            //     fetch('send.php', {
            //         method: 'POST',
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify(this.objData)
            //     })

            // }
        }

        const quizLove = new QuizLove(divQuizLove);

    }

}

