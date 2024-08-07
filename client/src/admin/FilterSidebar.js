import CategoryIcon from '@mui/icons-material/LocalOffer';
import PushPinIcon from '@mui/icons-material/PushPin';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BlockIcon from '@mui/icons-material/Block';
import { Card, CardContent } from '@mui/material';
import { CreateButton, ExportButton, FilterButton, FilterList, FilterListItem, FilterLiveSearch, TopToolbar } from 'react-admin';


export const FilterSidebar = () => (
    <Card sx={{ order: 1, mr:2 , mt: 8, width: 200 }}>
        <CardContent>
            <FilterLiveSearch />
            <FilterList label="Category" icon={<CategoryIcon />}>
                <FilterListItem label="FreeBoard" value={{ category: '1' }} />
                <FilterListItem label="ShortForm" value={{ category: '2' }} />
                <FilterListItem label="EventBoard" value={{ category: '3' }} />
                <FilterListItem label="POP-UP" value={{ category: 'popup' }} />
                <FilterListItem label="TMI" value={{ category: 'tmi' }} />
                <FilterListItem label="Recipe" value={{ category: 'recipe' }} />
                <FilterListItem label="Recommend" value={{ category: 'recommend' }} />
                <FilterListItem label="Event" value={{ category: 'event' }} />
            </FilterList>
            <FilterList label="PINNED POST" icon={<PushPinIcon />}>
                <FilterListItem label="Pinned" value={{ pinned: true }} />
            </FilterList>
            <FilterList label="HIDDEN POST" icon={<VisibilityOffIcon />}>
                <FilterListItem label="Hidden" value={{ hidden: true }} />
            </FilterList>
            <FilterList label="BANNED USER" icon={<BlockIcon />}>
                <FilterListItem label="Banned" value={{ banned: true }} />
            </FilterList>
        </CardContent>
    </Card>
);

export const ListActions = () => (
    <TopToolbar>
        <FilterButton/>
        <ExportButton/>
    </TopToolbar>
);