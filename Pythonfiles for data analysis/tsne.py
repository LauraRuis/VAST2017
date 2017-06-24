import json
from sklearn.manifold import TSNE
import numpy as np
import pandas as pd
import time
import ggplot

# choose a json with variables
with open("../Data/table_data.json", "r") as infile:
    data = json.load(infile)

# fill y with labels and x with matrix of vars
y = []
# empty matrix with specified number of variables
x = np.empty((0, 8))

# choose label
label = "car_type"
for ID, values in data.items():
    temp = []
    cols = []
    for key, value in values.items():
        if key != "route" and key != "entrance" and key != "camping" and key != "car_type" and key != "month":
            if key not in cols:
                cols.append(key)
            temp.append(value)
    # check dimension
    if len(temp) == 8:
        y.append(values[label])
        x = np.append(x, [temp], axis=0)


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
tsne = TSNE(n_components=2, verbose=1, perplexity=40, n_iter=300)
tsne_results = tsne.fit_transform(df.loc[rndperm[:n_sne], cols].values)

print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))

df_tsne = df.loc[rndperm[: n_sne], :].copy()
df_tsne['x-tsne'] = tsne_results[:, 0]
df_tsne['y-tsne'] = tsne_results[:, 1]

chart = ggplot.ggplot(df_tsne, ggplot.aes(x='x-tsne', y='y-tsne', color='label')) \
        + ggplot.geom_point(size=70, alpha=0.1) \
        + ggplot.ggtitle("tSNE dimensions colored by " + label)

print(chart)
