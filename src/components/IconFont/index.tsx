import defaultSettings from '@/config/defaultSettings';
import { createFromIconfontCN } from '@ant-design/icons';

const { iconFontUrl } = defaultSettings;

export default createFromIconfontCN({
    scriptUrl: iconFontUrl,
});
