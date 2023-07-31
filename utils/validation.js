export const validateEmail = (email) => {
    const regextSt = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regextSt.test(email);
}

export const validateCreateProduct = (product, images) => {
    let sizes = product.sizes;
    let details = product.details;
    let questions = product.questions;
    const checks = [{
        msg: "Name, Description, Brand added Successfully.",
        type: "success"
    }];
    if (images.length < 3) {
        checks.push({
            msg: `Choose atleast 3 images (${3 - images.length} remaining)`,
            type: "error"
        })
    } else {
        checks.push({
            msg: `${images.length} images choosen!`,
            type: "success"
        })
    }
    for(let i = 0; i<sizes.length; i++) {
        if(sizes[i].qty =="" || sizes[i].price == "") {
            checks.push({
                msg: `Please Fill Information of Quantity & Price.`,
                type: "error"
            });
            break;
        } else {
            checks.push({
                msg: `Price & Quantity Added Successfully`,
                type: "success"
            })
        }
    }
    for(let i = 0; i<details.length; i++) {
        if(details[i].name =="" || details[i].value == "") {
            checks.push({
                msg: `Please Fill Atleast One Information of Detail`,
                type: "error"
            });
            break;
        } else {
            checks.push({
                msg: `Atleast One Detail Added Successfully.`,
                type: "success"
            })
        }
    }
    for(let i = 0; i<questions.length; i++) {
        if(questions[i].question =="" || questions[i].answer == "") {
            checks.push({
                msg: `Please Fill Atleast One Information of Question`,
                type: "error"
            });
            break;
        } else {
            checks.push({
                msg: `Atleast One Question Added Successfully.`,
                type: "success"
            })
        }
    };
    var s_test = checks.find((c)=> c.type == "error");
    if(s_test) {
        return checks;
    } else {
        return "valid"
    }
}