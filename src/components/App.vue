<!-- Template -->
<template>
    <transition @leave="leave" @enter="enter">
        <router-view />
    </transition>
</template>


<!-- Script -->
<script>
export default {
    components: {},
    data: () => {
        return {};
        
    },
    
    created() {
        console.log("App component created successfully!")
        console.log(this.$store.state.context.dev ? 'Running in Development mode' : 'Running in Production mode')
    },

    methods: {
        enter(el, done) {
            // Do animation here and use done as callback
            el.style.display = "flex"
            done()
        },

        leave(el, done) {
            // Do animation here and use done as callback
            el.style.display = "none"
            done()
        }
    }
};
</script>


<!-- Style -->
<style lang="scss" scoped>
@import "Styles/globals.scss";
@import "Styles/mixins.scss";
</style>
