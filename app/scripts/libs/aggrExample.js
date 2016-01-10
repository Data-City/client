// jshint ignore: start
db.persons.aggregate([
    {
        $match: {
            ID: { $lt: 10 }
        }
    },
    {
        $group: {
            _id: {
                country: "$country",
                gender: "$gender"
            },
            buildings: {
                $addToSet: {
                    //"ID": "$ID",
                    "gender": "$gender",
                    "size": "$size (cm)",
                    "weight": "$weight (kg)",
                    "age": "$age",
                    "country": "$country"
                }
            },
            count: {
                $sum: 1
            }
        },
    },
    {
        $group: {
            _id: "$_id.country",
            districts: {
                $addToSet: {
                    "name": "$_id.gender",
                    "buildings": "$buildings",
                    "count": "$count"
                }
            },
            noOfDistricts: {
                $sum: 1
            }
        }
    },
    {
        $group: {
            _id: "city",
            districts: {
                $addToSet: {
                    "name": "$_id",
                    "districts": "$districts",
                    "count": "$noOfDistricts"
                }
            },
            count: {
                $sum: 1
            }
        }
    },
]).pretty();