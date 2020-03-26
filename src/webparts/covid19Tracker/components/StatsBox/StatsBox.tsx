import * as React from "react";
import styles from "./StatsBox.module.scss";
import { IStatsBoxProps } from "./IStatsBoxProps";
import { IconButton, Icon, css } from "office-ui-fabric-react";

export default class StatsBox extends React.Component<IStatsBoxProps,{}> 
{
    public render():React.ReactElement<IStatsBoxProps>{
        const active: number = this.props.totalConfirmed - (this.props.totalRecovered + this.props.totalDeaths);
        
        let {prevConfirmed, prevDeaths} = this.props;
        if(!prevConfirmed) prevConfirmed = 0;
        if(!prevDeaths) prevDeaths = 0;

        return (
            <div className={styles.statsBox}>
                <div className={styles.title}>
                    {this.props.displayName}
                    {this.props.showChangeLocation && (
                        <IconButton className={styles.editButton} onClick={this.props.onLocationChange}>
                            <Icon iconName="Edit"></Icon>
                        </IconButton>
                    )}
                </div>
                <div className={styles.container}>
                    <div className={styles.primaryRow}>
                        <div className={styles.primaryCol}>
                            <div className={styles.label}>Confirmed Cases</div>
                        </div>
                        <div className={styles.primaryCol}>
                            <div className={styles.count}>
                                {this.props.totalConfirmed.toLocaleString()}
                                <div className={styles.change}>
                                    {this.props.totalConfirmed > prevConfirmed ? 
                                    // Negative case
                                    <div className={css(styles.red, styles.up)}>{(this.props.totalConfirmed - prevConfirmed).toLocaleString()}</div> : 
                                    this.props.totalConfirmed < prevConfirmed ? 
                                    // Positive case
                                    <div className={css(styles.green, styles.down)}>{(prevConfirmed - this.props.totalConfirmed).toLocaleString()}</div> : 
                                    // Neutral case
                                    <div className={styles.neutral}>0</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.secondaryRow}>
                        <div className={styles.secondaryCol}>
                            <div className={styles.label}>Active Cases</div>
                        </div>
                        <div className={styles.secondaryCol}>
                            <div className={styles.count}>
                                {active.toLocaleString()}

                            </div>
                        </div>
                    </div>

                    <div className={styles.secondaryRow}>
                        <div className={styles.secondaryCol}>
                            <div className={styles.label}>Recovered Cases</div>
                        </div>
                        <div className={styles.secondaryCol}>
                            <div className={styles.count}>
                                {this.props.totalRecovered ? this.props.totalRecovered.toLocaleString() : "-"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.secondaryRow}>
                        <div className={styles.secondaryCol}>
                            <div className={styles.label}>Fatal Cases</div>
                        </div>
                        <div className={styles.secondaryCol}>
                            <div className={styles.count}>
                                {this.props.totalDeaths ? this.props.totalDeaths.toLocaleString() : "-"}
                                {/* <div className={styles.change}>
                                    {this.props.totalDeaths > prevDeaths ? 
                                    // Negative case
                                    <div className={css(styles.red, styles.up)}>{this.props.totalDeaths - prevDeaths}</div> : 
                                    this.props.totalDeaths < prevDeaths ? 
                                    // Positive case
                                    <div className={css(styles.green, styles.down)}>{prevDeaths - this.props.totalDeaths}</div> : 
                                    // Neutral case
                                    <div className={styles.neutral}>0</div>
                                    }
                                </div> */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
