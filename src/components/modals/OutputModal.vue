<template>
    <div id="output-modal">
        <header>
            <h1>Here's your code</h1>
        </header>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
                <h6 class="subtitle is-6">HTML</h6>
                <pre>{{html}}</pre>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
                <h6 class="subtitle is-6">CSS</h6>
                <pre>{{css}}</pre>
            </div>
        </div>
        <footer>

        </footer>
    </div>
</template>

<script>
    const initialState = () => {
        return {
            css: null,
            html: null
        };
    };

    export default {
        name: "OutputModal",
        data: initialState,
        methods: {
            cleanCss(dirtyCss) {
                const cleanCSS = dirtyCss;
                return cleanCSS;
            },
            cleanHTML(dirtyHTML) {
                const cleanHTML = dirtyHTML;
                return cleanHTML;
            }
        },
        mounted() {
            const passedCSS = this.$attrs.css;
            this.css = this.cleanCss(passedCSS);

            const passedHTML = this.$attrs.html;
            this.html = this.cleanHTML(passedHTML);

            // eslint-disable-next-line no-console
            console.log(this);
        }
    }
</script>

<style scoped>

</style>
