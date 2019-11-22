<!-- Template -->
<template>
    <div class="example">
        <div v-if="lessThanOrEquals('s')"> Mobile View </div>
        <div v-if="greaterThan('s')"> Desktop View </div>
    </div>
</template>


<!-- Script -->
<script>
import { mapGetters } from 'vuex'

export default {
    components: {},
    props: {},
    data: () => {
        return {
            
        }
    },

    computed: {
        ...mapGetters('context', [ 'lessThanOrEquals', 'lessThan', 'equals', 'greaterThan', 'greaterThanOrEquals' ]),
    }

};
</script>


<!-- Style -->
<style lang="scss" scoped>
@import "Assets/styles/mixins.scss";
@import "Assets/styles/globals.scss";

.example {
    color: black;
}
</style>
