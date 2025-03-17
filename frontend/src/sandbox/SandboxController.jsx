/* SandboxController.jsx
  *
  * AUTHOR(S): Mark Taylor
  *
  * PURPOSE: Controller portion of MVC for sandbox.
  * 
  * NOTES: I don't know if we are going to use this.
  */

// information to send format
/*
const test_model = [
    {
        type: "dense",
        inputShape: [5],
        units: 128,
        activation: "relu"
    },
    {
        type: "dropout",
        rate: 0.2
    },
    {
        type: "dense",
        units: 32,
        activiation: "relu"
    },
    {
        type: "dense",
        units: 32,
        activation: "relu"
    },
    {
        type: "dense",
        units: 1
    }
];
*/
class SandboxController {
    secret = "SECRET NOT SET";

    constructor(arg) {
        this.secret = arg;
    }

    test() {
        console.log("SandboxController.test: TEST, secret: " + this.secret);
        return("test");
    }
}

export default SandboxController