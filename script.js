const mapping = {
    name: { fn: getName, isVisible: true },
    city: { path: "location.city", isVisible: true },
    countryOfOrigin: { path: "location.country", isVisible: true },
    address: { path: "location.street.name", isVisible: true },
    src: { path: "picture.large", isVisible: true },

}

const mappingWithFunction = {
    name: { fn: getName, isVisible: true },
    name: { fn: getCity, isVisible: true },
}

function getName(user) {
    return `${user.name.first} ${user.name.last}`
}

function getCity(user) {
    return `${user.name.first} ${user.name.last}`
}





async function init() {

    try {
        const response = await getAPI({ url: "https://randomuser.me/api/?results=20" })
        const { results } = response
        // console.log(response);
        draw(response.results)

    } catch (err) {
        console.log(err)
        alert(`message: ${err.statusText} , status: ${err.status}`)
    }


    function draw(arrOfObjects) {



        const mappedUsers = arrOfObjects.map((user) => {
            return getMappedUser(user)
        })
        console.log(mappedUsers);

        const cards = mappedUsers.map(item => getCard(item))
        $("#container-data").append(...cards)



    }
    function getCard(user) {


        const div = $("<DIV></DIV>").addClass("cardDiv")
        const name = $("<h1></h1>").text(user.name)
        const img = $("<img></img>").attr("src", user.src)
        const country = $("<h1></h1>").text(user.countryOfOrigin)
        const btn = $("<button></button>")
        const container = $("<DIV></DIV>")
        btn.addClass("btn", "btn-primary")
        div.addClass("card", "col-lg-2")
        container.addClass("container")

        btn.text(`get more info `)
        btn.on("click", async () => {

            const userCountry = user.countryOfOrigin
            console.log(userCountry)
            const countryInfo = await getAPI({ url: `https://restcountries.eu/rest/v2/name/${userCountry}` })
            console.log(countryInfo[0].languages[0].name);
            const infoDiv = $("<div></div>").text(JSON.stringify(countryInfo[0].languages[0].name)).toggleClass("infoDiv")
            container.append(infoDiv)
        })


        container.append(country, btn)
        div.append(name, img, container)
        return div


    }

    function getMappedUser(user) {
        const keyValueMappingArray = Object.entries(mapping)
        return keyValueMappingArray.reduce((mappedUser, KEYVALUEPAIR_ARRAY,) => {
            const [key, settingObj] = KEYVALUEPAIR_ARRAY
            const { path } = settingObj
            const isFunction = typeof settingObj["fn"] === 'function'
            return { ...mappedUser, [key]: isFunction ? settingObj["fn"](user) : getValueFromPath(path, user) }
        }, {})
    }



    function getValueFromPath(path, user) {
        if (typeof path !== 'string') return
        const splittedPath = path.split(".")
        const theRequestedValue = splittedPath.reduce((currentUser, partOfPath) => {
            const isValueExist = currentUser[partOfPath]
            return isValueExist ? currentUser[partOfPath] : "Not Availble"
        }, user)
        return theRequestedValue
    }

}






(function () {
    init()
})()