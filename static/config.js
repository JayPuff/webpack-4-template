// This file will be included on the page before anything else runs.
// It is meant for configurations by using the window.staticConfig object that will be attempted to be read within the application
// The reason that this is not simply a JSON file, is because HTTP requesting it adds some complexity and is sometimes not possible depending on protocol (File)

// Note that this is mutable but it is meant as a read only object at the beginning of the application.
window.staticConfig = {
    someConfig: 'someValue'
}