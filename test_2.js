const PORT = process.env.APP_PORT || 3000;

const request = require("supertest")("http://localhost:3000/");
const assert = require("chai").assert;

const test_user1 = {
    first_name: "Test firstname",
    username: "test_user@digitalonus.com",
    last_name: "test lastname",
    password: "123456789",
};

const user1_update1 = {
    first_name: "updated firstname",
    last_name: "updated lastname",
    password: "12345678910",
    username: "test_user@digitalonus.com",
};

// Before Running the test, make sure the database table is empty


describe("Testing our Application", function () {
    it("POST /user", () => {
        return request
            .post("v1/user")
            .send(test_user1) // send payload data
            .then(res => {
                assert.equal(res.status, 201);
                // assert.equal(res.body.id, "1");
                assert.equal(res.body.username, test_user1.username);
                assert.equal(res.body.first_name, test_user1.first_name);
                assert.equal(res.body.last_name, test_user1.last_name);
            });
    });

    // Test GET
    it("GET /user/:id", () => {
        return request
            .get("v1/user/1")
            .auth(test_user1.username, test_user1.password)
            .then(res => {
                assert.equal(res.status, 200);
                // assert.equal(res.body.id, "1");
                assert.equal(res.body.username, test_user1.username);
                assert.equal(res.body.first_name, test_user1.first_name);
                assert.equal(res.body.last_name, test_user1.last_name);
                assert.doesNotHaveAnyKeys(res.body, ["password"]);
            });
    });

    // Test PUT
    it("PUT /user/:id", () => {
        return request
            .put("v1/user/1")
            .auth(test_user1.username, test_user1.password)
            .send(user1_update1)
            .then(res => {
                // console.log("res.body", res.body);
                assert.equal(res.status, 204);
            });
    });

    //TEST GET POST UPDATE
    it("GET After Updating Record /user/:id", () => {
        return request
            .get("v1/user/1")
            .auth(test_user1.username, user1_update1.password)
            .then(res => {
                assert.equal(res.status, 200);
                // assert.equal(res.body.id, "1");
                assert.equal(res.body.username, test_user1.username);
                assert.equal(res.body.first_name, user1_update1.first_name);
                assert.equal(res.body.last_name, user1_update1.last_name);
                assert.hasAllKeys(res.body, ["id", "first_name", "last_name", "username", "account_updated", "account_created"]);
                assert.doesNotHaveAnyKeys(res.body, ["password"]);
            });
    });

    it("POST /user test ignored account_created", () => {
        return request
            .post("v1/user")
            .send({
                ...test_user1,
                username: "test_email2@gmail.com",
                account_created: "2023-01-31T17:50:13.663Z",
                account_updated: "2023-01-31T17:50:13.663Z",
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 201);
                // assert.equal(res.body.id, "1");
                assert.equal(res.body.username, "test_email2@gmail.com");
                assert.notEqual(res.body.account_created, "2023-01-31T17:50:13.663Z");
                assert.notEqual(res.body.account_created, "2023-01-31T17:50:13.663Z");
                assert.equal(res.body.first_name, test_user1.first_name);
                assert.equal(res.body.last_name, test_user1.last_name);
            });
    });


});

describe("Testing POST request validations", function () {
    // TEST POST same username
    it("FAIL POST /user with existing username", () => {
        return request
            .post("v1/user")
            .send({
                ...test_user1,
            })
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 400);
            });
    });

    // TEST extra fields POST
    it("FAIL POST /user with extra fields", () => {
        return request
            .post("v1/user")
            .send({
                ...test_user1,
                extra_field: "extra field",
                username: "newuser@gmail.com",
            }) // send payload data
            .then(res => {
                assert.equal(res.status, 400);
            });
    });

    // TEST insuffcient fields POST
    it("FAIL POST /user with insuffcient fields", () => {
        return request
            .post("v1/user")
            .send({
                first_name: "Test firstname",
                username: "test_user@digitalonus.com",
                last_name: "test lastname",
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 400);
            });
    });

    // TEST empty fields POST
    it("FAIL POST /user with empty fields", () => {
        return request
            .post("v1/user")
            .send({
                first_name: "Test firstname",
                username: "test_user1@digitalonus.com",
                last_name: "",
                password: "testpassword",
                
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 400);
            });
    });


    // NOTE: change status code to 200 
    // if you dont have password limit on model
    it("FAIL POST /user with password ", () => {
        return request
            .post("v1/user")
            .send({
                ...test_user1,
                username: "testmail3@gmail.com",
                password: "12"
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 201);
            });
    });


});

describe("Testing PUT validations", function () {
    // TEST PUT with extra fields
    it("400 PUT /user/:id with extra fields", () => {
        return (
            request
                .put("v1/user/1")
                .auth(test_user1.username, user1_update1.password)
                .send({
                    ...user1_update1,
                    extra_field: "extra field",
                }) // send payload data
                .then(res => {
                    // console.log(res.body);
                    assert.equal(res.status, 400);
                })
        );
    });

    // TEST PUT with less fields
    it("PUT /user/:id with only few fields", () => {
        return (
            request
                .put("v1/user/1")
                .auth(test_user1.username, user1_update1.password)
                .send({
                    first_name: "updated firstname2",
                    last_name: "updated lastname2",
                }) // send payload data
                .then(res => {
                    // console.log(res.body);
                    assert.equal(res.status, 400);
                })
        );
    });


    // TEST PUT with less fields
    it("PUT /user/:id with only few f_name", () => {
        return (
            request
                .put("v1/user/1")
                .auth(test_user1.username, user1_update1.password)
                .send({
                    first_name: "updated firstname2"
                }) // send payload data
                .then(res => {
                    // console.log(res.body);
                    assert.equal(res.status, 400);
                })
        );
    });

    // TEST PUT with less fields
    it("PUT /user/:id with only few f_name & password", () => {
        return (
            request
                .put("v1/user/1")
                .auth(test_user1.username, user1_update1.password)
                .send({
                    first_name: "updated firstname2",
                    password: user1_update1.password
                }) // send payload data
                .then(res => {
                    // console.log(res.body);
                    assert.equal(res.status, 400);
                })
        );
    });

    // TEST PUT with less fields
    it("PUT /user/:id with only few f_name, password & empty l_name", () => {
        return (
            request
                .put("v1/user/1")
                .auth(test_user1.username, user1_update1.password)
                .send({
                    first_name: "updated firstname2",
                    l_name: "",
                    password: user1_update1.password

                }) // send payload data
                .then(res => {
                    // console.log(res.body);
                    assert.equal(res.status, 400);
                })
        );
    });

    // NOTE: change status code to 200 
    // if you dont have password limit on model
    // it("FAIL PUT /user with small password ", () => {
    //     return request
    //         .put("v1/user/1")
    //         .auth(test_user1.username, user1_update1.password)
    //         .send({
    //             ...user1_update1,
    //             password: "12"
    //         }) // send payload data
    //         .then(res => {
    //             console.log(res.body);
    //             assert.equal(res.status, 400);
    //         });
    // });

    // Test PUT FAIL update fields other than password, first_name, last_name
    it("Update user with a read only field", () => {
        return request
            .put("v1/user/1")
            .auth(test_user1.username, user1_update1.password)
            .send({...user1_update1, id: ""})
            .then(res => {
                assert.equal(res.status, 400);
            });
    });


});

describe("Testing PUT AUTH validations", function () {
    it("BAD REQUEST 400: PUT /user/:id with wrong username", () => {
        return request
            .put("v1/user/1")
            .auth("test_user1.username", user1_update1.password)
            .send({
                ...user1_update1,
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 401);
            });
    });


    // TEST PUT with wrong password
    it("UNAUTHORIZED 401: PUT /user/:id with wrong password", () => {
        return request
            .put("v1/user/1")
            .auth(test_user1.username, "user1_update1.password")
            .send({
                ...user1_update1,
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 401);
            });
    });

    // TEST PUT with correct credentials, forbidden resource
    it("FORBIDDEN /user/:id Access different user ID", () => {
        return request
            .put("v1/user/2")
            .auth(test_user1.username, user1_update1.password)
            .send({
                ...user1_update1,
            }) // send payload data
            .then(res => {
                // console.log(res.body);
                assert.equal(res.status, 403);
            });
    });

});

describe("Testing GET AUTH validations", function () {
    // TEST GET with wrong password
    it("GET /user/:id with wrong Password", () => {
        return request
            .get("v1/user/1")
            .auth(test_user1.username, "randompassword")
            .then(res => {
                assert.equal(res.status, 401);
            });
    });

    // TEST GET with wrong username
    it("GET /user/:id with wrong username", () => {
        return request
            .get("v1/user/1")
            .auth("username", user1_update1.password)
            .then(res => {
                assert.equal(res.status, 401);
            });
    });


    it("GET /user/:id Accessing wrong resource", () => {
        return request
            .get("v1/user/2")
            .auth(test_user1.username, user1_update1.password)
            .then(res => {
                assert.equal(res.status, 403);
            });
    });
});

// POST - acc_create and acc_update any val provide should be ignored
// PUT - any field except first , last and pass should throw error
// password len check in post and put
