import { releaseFormatsUtil } from '@/utils/project/projectDetailsUtil';

const ProjectFormats = ({ items = [] }) => releaseFormatsUtil({ formats: items });

export default ProjectFormats;
