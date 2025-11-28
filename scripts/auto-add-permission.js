const userList = {
    636520:4,//4
    643619:3530,
    636521:840,
    648614:3336,
    638506:22,
    632227:518,
}

const roleList = [
    {
        "id": "1",
        "code": "EHS000",
        "name": "Quantum Admin",
        "level": 0,
        "systemic": "1",
        "corporateId": null,
        "permissions": null,
        "modules": null,
        "corporateDto": null,
        "groupCodes": [
            {
                "id": "1",
                "code": "EHS000",
                "name": "Quantum Admin",
                "level": 0,
                "systemic": "1",
                "corporateId": null,
                "permissions": null,
                "modules": null,
                "corporateDto": null,
                "groupCodes": null
            }
        ]
    },
    {
        "id": "2",
        "code": "EHS001",
        "name": "System Admin",
        "level": 1,
        "systemic": "1",
        "corporateId": 1,
        "permissions": null,
        "modules": null,
        "corporateDto": null,
        "groupCodes": [
            {
                "id": "2",
                "code": "EHS001",
                "name": "System Admin",
                "level": 1,
                "systemic": "1",
                "corporateId": 1,
                "permissions": null,
                "modules": null,
                "corporateDto": null,
                "groupCodes": null
            }
        ]
    },
    {
        "id": "19",
        "code": "SDS002",
        "name": "SDS User",
        "level": 2,
        "systemic": "0",
        "corporateId": null,
        "permissions": null,
        "modules": null,
        "corporateDto": null,
        "groupCodes": [
            {
                "id": "18",
                "code": "SDS001",
                "name": "SDS Admin",
                "level": 2,
                "systemic": "0",
                "corporateId": null,
                "permissions": null,
                "modules": null,
                "corporateDto": null,
                "groupCodes": null
            },
            {
                "id": "19",
                "code": "SDS002",
                "name": "SDS User",
                "level": 2,
                "systemic": "0",
                "corporateId": null,
                "permissions": null,
                "modules": null,
                "corporateDto": null,
                "groupCodes": null
            }
        ]
    }
]

const apiEntry = "localhost:8080"
const getUserInfoApi = `http://${apiEntry}/facts_backend-2.6/rest/employees/`;
const updateUserInfoApi = `http://${apiEntry}/facts_backend-2.6/rest/employees`;
const token = "9be2f1bbed5ddd5a1ec095f1054b845a";

async function getUserInfo(userId){
    try {
        const header = {
            'Content-Type': 'application/json',
            'token': `${token}`,
        }
        let fetchUserInfo = await fetch(`${getUserInfoApi}${userId}`, {
            method: 'GET',
            headers: header,
        })
        if (!fetchUserInfo.ok) {
            throw new Error(`Failed to fetch user info: ${fetchUserInfo.statusText}`);
        }
        return fetchUserInfo.json();
    }
    catch(error){
        console.error("Error fetching user info", error);
    }
}


async function updateUserInfo(userId){
    try {
        const header = {
            'Content-Type': 'application/json',
            'token': `${token}`,
        }
        let fetchUserInfo = await fetch(`${getUserInfoApi}${userId}`, {
            method: 'GET',
            headers: header,
        })
        if (!fetchUserInfo.ok) {
            throw new Error(`Failed to fetch user info: ${fetchUserInfo.statusText}`);
        }
        const userInfo = (await fetchUserInfo.json()).DATA;

        console.log("userInfo", userInfo);
        
        console.log("userInfo", userInfo, roleList);

        if (userInfo.userInfo.roles.length < 3){
            console.log (`add role to user ${userId}`);

            userInfo.userInfo.roles = [...roleList];
            let updateUserInfo = await fetch(`${updateUserInfoApi}`, {
                method: 'PUT',
                headers: header,
                body: JSON.stringify(userInfo),
            })
            if (!updateUserInfo.ok) {
                throw new Error(`Failed to update user info: ${updateUserInfo.statusText}`);
            }   
            // const updatedUserInfo = await updateUserInfo.json();
            console.log("updatedUserInfo", updateUserInfo.json());
        }
        
        // return updatedUserInfo;

    }catch(error){
        console.error("Error updating user info", error);
    }
}

async function main() {
    for (const [userName, userId] of Object.entries(userList)) {
        console.log("userId", userId);
        // const userInfo = await getUserInfo(userId);
        // console.log("userInfo", userInfo);
        await updateUserInfo(userId);
    }
}

main();
