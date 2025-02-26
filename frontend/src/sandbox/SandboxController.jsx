// class test
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