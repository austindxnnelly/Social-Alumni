/** converts string s to lowercase
 * 
 * @param {*} s string to normalise
 * @returns the string in lower case form
 */
function string_normalize(s) {
    return s.toLowerCase();
}

/**  returns true if search_string is a substring of property
 * 
 * @param {*} property the data field to be searched
 * @param {*} search the search value
 * @returns true/false based on whether or not the property contains the search value
 */
function string_match(property, search) {
    let d = String.property;
    let s = String.search;
    return property.includes(search)
}

function isString (input){
    return typeof input
}

/** Uses string match to find users who satisfy the search value
 * 
 * @param {*} users takes the users from database
 * @param {*} search the search value
 * @returns the users which fields satisfy the search value
 */
function search_string(users, search) {
    return users.filter(b => (
        string_match(b.first_name, search)
        || string_match(b.last_name, search)
        || string_match(b.email, search)
    ))
}

/** the main function called by the app, validates the search function is lega;
 * 
 * @param {*} search the value to search by
 * @param {*} all_users all of the users in the database
 * @returns The filtered users
 */
function filter_users(search, all_users) {

    var results = all_users;
        // filter by search string
        if (search !== undefined && search !== "") {
            results = search_string(results, search);
        }

        return results
}

module.exports = { filter_users }