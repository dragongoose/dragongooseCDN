# dragongooseCDN
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FDragonshadow14%2FdragongooseCDN.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FDragonshadow14%2FdragongooseCDN?ref=badge_shield)


dragongooseCDN is a (somewhat) simple file uploading server based around ShareX

## Installation

Clone the repository using `git clone https://github.com/Dragonshadow14/dragongooseCDN`

## Usage

First, you are going to have to creation a config.json file.
It should look like so:
```json
{
    "port": "PORT TO RUN SERVER ON",
    "api_key": ["KEY_TO_ACCESS_SERVER"],
    "allowedExtensions": ["EXTENSION (mp4, etc)"],
    "bannedips": [""],
    "domain": "DOMAIN"
}
```

After that, you are going to need to create a `logs` and `uploads` folder.
For the uploads folder, you need to add a folder inside of it for each api key.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FDragonshadow14%2FdragongooseCDN.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FDragonshadow14%2FdragongooseCDN?ref=badge_large)