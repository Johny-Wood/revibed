import cloneDeep from 'lodash/cloneDeep';

import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

export const updateBaseInfoHandlersUtil = ({ data, type, projectFindIdx, value, location }) => {
  const projectsTmp = cloneDeep(data);

  if (projectFindIdx > -1 && projectsTmp && projectsTmp[projectFindIdx]) {
    switch (type) {
      case ProjectBaseInfoConstants.PROJECT_MEDIA_CONDITION_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          mediaCondition: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_SLEEVE_CONDITION_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          sleeveCondition: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_MEDIA_SOLD_OUT: {
        const { priceSale } = value;

        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          priceSell: priceSale,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_MEDIA_ON_SALE: {
        const { price } = value;

        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          priceSell: price,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_COVERS_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          covers: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_MAIN_COVER_CHANGED: {
        const project = projectsTmp[projectFindIdx] || {};
        const { covers: coversFromState = [] } = project;

        let covers = cloneDeep(coversFromState);
        const coverNewMainIdx = covers.findIndex(({ id }) => id === +value);

        if (coverNewMainIdx > -1) {
          covers = covers.map((cover) => ({
            ...cover,
            isMain: false,
          }));

          covers[coverNewMainIdx] = {
            ...covers[coverNewMainIdx],
            isMain: true,
          };
        }

        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          covers,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_ALBUM_TITLE_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          albumTitle: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_TITLE_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          title: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_DESCRIPTION_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          description: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_COUNTRY_CHANGED: {
        const tagsTmp = cloneDeep(projectsTmp[projectFindIdx].tags);
        const tagFindIdx = tagsTmp.findIndex(({ destinationKey }) => destinationKey === 'COUNTRY');

        if (tagFindIdx > -1) {
          tagsTmp[tagFindIdx] = {
            ...tagsTmp[tagFindIdx],
            name: value.title_en,
            queryParam: value.id,
          };
        } else {
          tagsTmp.push({
            destinationKey: 'COUNTRY',
            name: value.title_en,
            queryParam: value.id,
          });
        }

        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          tags: tagsTmp,
          releaseDetails: {
            ...projectsTmp[projectFindIdx].releaseDetails,
            country: value,
          },
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_FOUNDER_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          founder: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_PRIVATE_STATUS_CHANGED: {
        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          isPrivate: value,
        };
        break;
      }
      case ProjectBaseInfoConstants.PROJECT_YEAR_CHANGED: {
        const tagsTmp = cloneDeep(projectsTmp[projectFindIdx].tags);
        const tagFindIdx = tagsTmp.findIndex(({ destinationKey }) => destinationKey === 'YEAR');

        if (tagFindIdx > -1) {
          tagsTmp[tagFindIdx] = {
            ...tagsTmp[tagFindIdx],
            name: value,
            queryParam: value,
          };
        } else {
          tagsTmp.push({
            destinationKey: 'YEAR',
            name: value,
            queryParam: value,
          });
        }

        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          tags: tagsTmp,
          releaseDetails: {
            ...projectsTmp[projectFindIdx].releaseDetails,
            year: value,
          },
        };
        break;
      }
      default: {
        break;
      }
    }

    if (location === 'PROJECTS' || location === 'PROJECT') {
      switch (type) {
        case ProjectBaseInfoConstants.PROJECT_LATE_ENTRY_STATUS_CHANGED: {
          const { name } = value || {};
          const { lateEntryInfo = {}, lateEntryInfo: { available } = {} } = projectsTmp[projectFindIdx];

          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            lateEntryStatus: value || {},
            lateEntryInfo: {
              ...lateEntryInfo,
              available: projectsStatusesUtil.isLateEntryStatus(name) || available,
            },
          };

          break;
        }
        case ProjectBaseInfoConstants.PROJECT_STATUS_CHANGED: {
          const { startDate } = projectsTmp[projectFindIdx];

          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            status: value,
            startDate: projectsStatusesUtil.isOpenStatus(value) ? new Date().valueOf() : startDate,
          };

          break;
        }
        case ProjectBaseInfoConstants.PROJECT_CONTRIBUTOR_USE_GEM: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            gemsFreeCount: Math.max(0, projectsTmp[projectFindIdx].gemsFreeCount - 1),
          };
          break;
        }
        default: {
          break;
        }
      }
    }

    if (location === 'PROJECT') {
      switch (type) {
        case ProjectBaseInfoConstants.PROJECT_FORMATS_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            releaseDetails: {
              ...projectsTmp[projectFindIdx].releaseDetails,
              formats: value,
            },
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_STYLES_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            releaseDetails: {
              ...projectsTmp[projectFindIdx].releaseDetails,
              styles: value,
            },
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_GENRES_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            releaseDetails: {
              ...projectsTmp[projectFindIdx].releaseDetails,
              genres: value,
            },
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_LINK_DISCOGS_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            discogsLink: value,
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_RIPPER_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            ripper: value,
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_SHIP_FROM_OPEN_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            shippingFrom: value,
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_PRICE_SELL_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            priceSell: value,
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_LINK_DISCOGS_MARKETPLACE_LISTED_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            marketplaceLinkSell: value,
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_DESTINATION_ADDRESS_NAME_TO_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            shippingInfo: {
              ...projectsTmp[projectFindIdx].shippingInfo,
              name: value,
            },
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_DESTINATION_ADDRESS_COUNTRY_TO_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            shippingInfo: {
              ...projectsTmp[projectFindIdx].shippingInfo,
              country: value,
            },
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_DESTINATION_ADDRESS_ADDRESS_TO_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            shippingInfo: {
              ...projectsTmp[projectFindIdx].shippingInfo,
              address: value,
            },
          };
          break;
        }
        case ProjectBaseInfoConstants.PROJECT_DESTINATION_ADDRESS_RIPPER_COMPENSATION_TO_CHANGED: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            shippingInfo: {
              ...projectsTmp[projectFindIdx].shippingInfo,
              shippingBudget: value,
            },
          };
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  return projectsTmp;
};
