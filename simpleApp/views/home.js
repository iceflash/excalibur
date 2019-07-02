let View = {};

function render(element){
    console.log(element);

    const res = `
    <h1>home route</h1>
    <h1>This is header 1</h1>
        <p>paragraph</p>
        <div class="formDlg">
            <p>paragraph</p>
            <div>
                <infoText data-v="field">111</infoText>
    
                <div id="infoText" data-info="" data-v="field">field 1:</div>
    
                <input id="formField" data-v="field">
            </div>
            <div>                
            </div>

            <span class="btn glow">Try it now!</span>
        </div>
    `;
    element.innerHTML = res;

    // const formField = document.getElementById('formField');
    // // console.log(formField.attributes['data-v'].value);

    // formField.addEventListener('input', (event) => {
    //     app.data[formField.attributes['data-v'].value] = formField.value;
    // });

    // return res;
}

View.render = render;

export default View;