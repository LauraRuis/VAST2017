import json
from sklearn.manifold import TSNE
import numpy as np
import pandas as pd
import time
import ggplot


def tsne(files, total_data):
    print(files)
    data_dict = {}
    # fill y with labels and x with matrix of vars
    y = []
    ids = []
    # empty matrix with specified number of variables
    x = np.empty((0, 3))
    for file in files:
        with open("../Data/vars per week for tsne/" + file, "r") as infile:
            data = json.load(infile)

        # choose label
        label = "car_type"
        for ID, values in data.items():
            temp = []
            cols = []
            for key, value in values.items():
                if key != "route" and key != "entrance" and key != "camping" and key != "car_type" and key != "month" and key != "stayed_night" and key != "stayed_outside" and key != "nightly_movement" and key != "highseason" and key != "weekend":
                    if key not in cols:
                        cols.append(key)
                    temp.append(value)
            # check dimension
            if len(temp) == 3:
                y.append(ID)
                x = np.append(x, [temp], axis=0)
                ids.append(ID)

    y = np.array(y)
    print(x.shape, y.shape)
    print(cols)
    print(len(cols))

    # put in dataframe
    df = pd.DataFrame(x, columns=cols)

    # set label
    df['label'] = y
    X, y = None, None

    print('Size of the dataframe: {}'.format(df.shape))

    # take random permutation of data
    rndperm = np.random.permutation(df.shape[0])
    n_sne = 5000

    time_start = time.time()
    tsne = TSNE(n_components=2, verbose=2, perplexity=30, n_iter=300)
    tsne_results = tsne.fit_transform(df.loc[rndperm[:n_sne], cols].values)

    print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))

    df_tsne = df.loc[rndperm[: n_sne], :].copy()
    df_tsne['x-tsne'] = tsne_results[:, 0]
    df_tsne['y-tsne'] = tsne_results[:, 1]
    # print("Y: ", df_tsne['y-tsne'])
    # print("X: ", df_tsne['x-tsne'])
    print(df_tsne.index[0])
    print(df.loc[df_tsne.index[0]])
    print(ids[df_tsne.index[0]])
    print(df_tsne)
    print(len(df_tsne['y-tsne']))
    for i in range(len(df_tsne['y-tsne'])):
        data_dict[df_tsne['label'][i]] = {}
    for i in range(len(df_tsne['y-tsne'])):
        data_dict[df_tsne["label"][i]]["x"] = df_tsne['x-tsne'][i]
        data_dict[df_tsne["label"][i]]["y"] = df_tsne['y-tsne'][i]
        data_dict[df_tsne["label"][i]]["number_days"] = df_tsne['number_days'][i]
        data_dict[df_tsne["label"][i]]["speed"] = df_tsne['speed'][i]
        data_dict[df_tsne["label"][i]]["number_stops"] = df_tsne['number_stops'][i]
        data_dict[df_tsne["label"][i]]["car_type"] = total_data[df_tsne['label'][i]]["car_type"]

    print(data_dict)

    OUTFILE = open("../Data/tsne/" + files[0].split(".json")[0] + "_" + files[-1], "w")
    json.dump(data_dict, OUTFILE, indent=4, separators=(',', ': '))
    OUTFILE.write('\n')
    # chart = ggplot.ggplot(df_tsne, ggplot.aes(x='x-tsne', y='y-tsne', color='label')) \
    #         + ggplot.geom_point(size=70, alpha=1) \
    #         + ggplot.ggtitle("tSNE dimensions colored by " + label)

    # print(chart)
    return [df_tsne['x-tsne'], df_tsne['y-tsne']]


if __name__ == "__main__":

    with open("../Data/vars_per_id.json", 'r') as infile:
        data = json.load(infile)
    # choose a json with variables
    # temp = []
    # for i in range(36, 59):
    #     if len(temp) == 4:
    #         tsne(temp, data)
    #         temp = []
    #     if i < 35:
    #         name = "vars_" + str(i + 18) + "-2015.json"
    #     else:
    #         name = "vars_" + str(i - 35) + "-2016.json"
    #     temp.append(name)
    temp1 = ["vars_50-2015.json", "vars_51-2015.json", "vars_52-2015.json"]
    tsne(temp1, data)
    temp2 = ["vars_21-2016.json", "vars_22-2016.json"]
    tsne(temp2, data)