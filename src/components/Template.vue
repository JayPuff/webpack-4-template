<!-- Template -->
<template>
    <div class="template">
        
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
        ...mapGetters('context', [ 'lessThanOrEqual', 'lessThan', 'equals', 'greaterThan', 'greaterThanOrEquals' ]),
    } 

};
</script>


<!-- Style -->
<style lang="scss" scoped>
@import "Styles/mixins.scss";
@import "Styles/globals.scss";

.template {
    
}
</style>
