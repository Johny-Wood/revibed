import { releaseGenresUtil } from '@/utils/project/projectDetailsUtil';

const ProjectGenres = ({ items = [] }) => releaseGenresUtil({ genres: items });

export default ProjectGenres;
