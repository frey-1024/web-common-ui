import {addDecorator, addParameters} from "@storybook/react";
import {withInfo} from '@storybook/addon-info'
import {withKnobs} from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';

addDecorator(withInfo);
addDecorator(withKnobs);

addParameters({
    options: {
        theme: themes.light,
        name: 'Autobest-common-ui',
        url: '/',
        title:'autobest-common-ui'
    },
    info: {
        header: false,
        inline: false,
        source: true,
        // TableComponent: () => null
        // disable: true
    },
});